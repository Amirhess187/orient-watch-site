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
const PHRASE_INTERVAL_MS = 2600;
const PHRASE_FADE_MS = 350;

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

  const percent = Math.min(100, Math.round(progress * 100));

  return (
    <div className={`loader ${exiting ? "loader--exit" : ""}`} aria-hidden="true">
      <div className="loader__content">
        <span className="loader__mark">ا</span>
        <span className="loader__wordmark">اورینت</span>
        <p className={`loader__phrase ${phraseVisible ? "" : "loader__phrase--hidden"}`}>
          {PHRASES[phraseIndex]}
        </p>
        <div className="loader__bar">
          <div className="loader__bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
