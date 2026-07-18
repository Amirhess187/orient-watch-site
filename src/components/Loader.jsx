import { useEffect, useState } from "react";
import "./Loader.css";

const MIN_VISIBLE_MS = 500;
// A true last resort (e.g. a request that never settles) — not a normal-path
// cap. Frame loads always eventually resolve (errors still count toward
// progress), so this should essentially never fire in practice.
const FALLBACK_MS = 45000;
const EXIT_DURATION_MS = 500;
const READY_THRESHOLD = 0.98;

const PHRASES = [
  "سکوت را در جزئیات می‌جویند.",
  "آرامش را در ژرفا جست‌وجو می‌کنند، نه در سطح.",
  "هر قطعه، دستِ یک استاد.",
  "سه عنصر طبیعت، یک ساعت اورینت.",
  "کیفیت، عجله نمی‌شناسد.",
  "دقت، در سکوت شکل می‌گیرد.",
];
const PHRASE_INTERVAL_MS = 4800;
const PHRASE_FADE_MS = 450;

const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function Loader({ progress }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    const fallbackTimer = setTimeout(() => setForceReady(true), FALLBACK_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let fadeTimer;
    const interval = setInterval(() => {
      if (reduceMotion) {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        return;
      }
      setPhraseVisible(false);
      fadeTimer = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setPhraseVisible(true);
      }, PHRASE_FADE_MS);
    }, PHRASE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, []);

  const contentReady = progress >= READY_THRESHOLD || forceReady;

  useEffect(() => {
    if (!minTimeElapsed || !contentReady) return;

    let cancelled = false;
    Promise.resolve(document.fonts?.ready).finally(() => {
      if (!cancelled) setExiting(true);
    });

    return () => {
      cancelled = true;
    };
  }, [minTimeElapsed, contentReady]);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => setMounted(false), EXIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [exiting]);

  useEffect(() => {
    document.body.style.overflow = mounted ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted) return null;

  const clampedProgress = Math.min(1, progress);
  const ringOffset = RING_CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <div className={`loader ${exiting ? "loader--exit" : ""}`} aria-hidden="true">
      <span className="loader__brand">Orient</span>
      <div className="loader__content">
        <div className="loader__ring-wrap">
          <svg className="loader__ring" viewBox="0 0 100 100">
            <circle
              className="loader__ring-track"
              cx="50"
              cy="50"
              r={RING_RADIUS}
            />
            <circle
              className="loader__ring-progress"
              cx="50"
              cy="50"
              r={RING_RADIUS}
              style={{
                strokeDasharray: RING_CIRCUMFERENCE,
                strokeDashoffset: ringOffset,
              }}
            />
          </svg>
          <span className="loader__mark">
            <svg
              className="loader__mark-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.3" />
              <line x1="12" y1="12" x2="7.7" y2="9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="12" y1="12" x2="16.3" y2="8.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="12" cy="12" r="0.9" fill="currentColor" />
            </svg>
          </span>
        </div>
        <p className={`loader__phrase ${phraseVisible ? "" : "loader__phrase--hidden"}`}>
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  );
}
