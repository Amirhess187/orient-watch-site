import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollFrameSequence.css";

gsap.registerPlugin(ScrollTrigger);

const IMAGE_SCALE = 0.86;
const EDGE_FADE = 0.06;
const BACKGROUND_LOAD_CONCURRENCY = 8;

function frameUrl(framesBase, index) {
  return `${framesBase}frame_${String(index + 1).padStart(4, "0")}.webp`;
}

function fadeWindow(progress, start, end, fade = EDGE_FADE) {
  if (progress < start - fade || progress > end + fade) return 0;
  if (progress < start) return (progress - (start - fade)) / fade;
  if (progress > end) return 1 - (progress - end) / fade;
  return 1;
}

export default function ScrollFrameSequence({
  id,
  framesBase,
  frameCount,
  heightVh = 360,
  bgColor = "#0a0908",
  className = "",
  introBlack = 0.12,
  outroBlack = 0.88,
  introContent,
  beats = [],
  onReady,
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const blackRef = useRef(null);
  const introRef = useRef(null);
  const imagesRef = useRef([]);
  const loadingRef = useRef(new Set());
  const currentFrameRef = useRef(-1);
  const latestTargetRef = useRef(-1);
  const redrawRef = useRef(null);
  const beatRefs = useRef([]);
  const onReadyFiredRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Loads a single frame, de-duplicating in-flight requests. Whichever caller
  // triggers the real network request, arrival redraws the canvas if that
  // frame is still what the scroll position currently wants — this lets a
  // fast scroll "jump the queue" and see its frame the instant it lands,
  // instead of waiting for the next scroll tick to notice it loaded.
  const loadFrame = useCallback((i) => {
    const images = imagesRef.current;
    if (images[i]) return Promise.resolve(images[i]);
    if (loadingRef.current.has(i)) return Promise.resolve(null);
    loadingRef.current.add(i);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        loadingRef.current.delete(i);
        if (latestTargetRef.current === i) redrawRef.current?.(i);
        resolve(img);
      };
      img.onerror = () => {
        loadingRef.current.delete(i);
        resolve(null);
      };
      img.src = frameUrl(framesBase, i);
    });
  }, [framesBase]);

  useEffect(() => {
    if (onReadyFiredRef.current || !onReady) return;
    if (reduceMotion || ready) {
      onReadyFiredRef.current = true;
      onReady();
    }
  }, [reduceMotion, ready, onReady]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    imagesRef.current = new Array(frameCount);
    loadingRef.current = new Set();

    const FIRST_BATCH = Math.min(10, frameCount);

    (async () => {
      await Promise.all(
        Array.from({ length: FIRST_BATCH }, (_, i) => loadFrame(i))
      );
      if (cancelled) return;
      setReady(true);

      // Stream the remaining frames with several requests in flight at once —
      // loading them one at a time is latency-bound and, on a real network
      // (unlike localhost), can take far longer than the user needs to scroll
      // past what's already loaded.
      let next = FIRST_BATCH;
      async function worker() {
        while (!cancelled && next < frameCount) {
          await loadFrame(next++);
        }
      }
      await Promise.all(
        Array.from(
          { length: Math.min(BACKGROUND_LOAD_CONCURRENCY, frameCount - FIRST_BATCH) },
          worker
        )
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [frameCount, reduceMotion, loadFrame]);

  useEffect(() => {
    if (reduceMotion || !ready) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      drawFrame(Math.max(currentFrameRef.current, 0));
    }

    function drawFrame(index) {
      const img = imagesRef.current[index];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    resize();
    window.addEventListener("resize", resize);

    redrawRef.current = (index) => {
      currentFrameRef.current = index;
      requestAnimationFrame(() => drawFrame(index));
    };

    const videoSpan = Math.max(outroBlack - introBlack, 0.01);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        const videoProgress = Math.min(
          Math.max((p - introBlack) / videoSpan, 0),
          1
        );
        const targetIndex = Math.min(
          Math.floor(videoProgress * frameCount),
          frameCount - 1
        );
        latestTargetRef.current = targetIndex;
        if (!imagesRef.current[targetIndex]) loadFrame(targetIndex);

        let index = targetIndex;
        while (index > 0 && !imagesRef.current[index]) index--;
        if (index !== currentFrameRef.current) {
          currentFrameRef.current = index;
          requestAnimationFrame(() => drawFrame(index));
        }

        let blackOpacity = 0;
        let introOpacity = 0;
        if (p <= introBlack) {
          blackOpacity = 1 - Math.min(p / Math.max(introBlack, 0.001), 1);
          introOpacity = blackOpacity;
        }
        if (blackRef.current) blackRef.current.style.opacity = blackOpacity;
        if (introRef.current) introRef.current.style.opacity = introOpacity;

        beats.forEach((beat, i) => {
          const el = beatRefs.current[i];
          if (!el) return;
          const o = fadeWindow(p, beat.start, beat.end);
          el.style.opacity = o;
          el.style.transform = `translateY(${(1 - o) * 16}px)`;
          el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        });
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      redrawRef.current = null;
      trigger.kill();
    };
  }, [ready, reduceMotion, frameCount, bgColor, beats, introBlack, outroBlack, loadFrame]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={`scroll-frame-section ${className}`}
      style={{ height: reduceMotion ? undefined : `${heightVh}vh` }}
    >
      <div className="scroll-frame-sticky">
        {reduceMotion ? (
          <img
            className="scroll-frame-poster"
            src={frameUrl(framesBase, Math.floor(frameCount / 2))}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <>
            <canvas ref={canvasRef} className="scroll-frame-canvas" />
            <div
              ref={blackRef}
              className="scroll-frame-black"
              style={{ background: bgColor, opacity: 1 }}
              aria-hidden="true"
            />
            {introContent && (
              <div ref={introRef} className="scroll-frame-intro">
                {introContent}
              </div>
            )}
            {beats.map((beat, i) => (
              <div
                key={beat.key ?? i}
                ref={(el) => (beatRefs.current[i] = el)}
                className={`scroll-frame-beat scroll-frame-beat--${beat.side ?? "right"}`}
                style={{ opacity: 0 }}
              >
                {beat.content}
              </div>
            ))}
          </>
        )}

        {reduceMotion && (introContent || beats[0]) && (
          <div className="scroll-frame-beat scroll-frame-beat--right" style={{ opacity: 1 }}>
            {introContent ?? beats[0].content}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
