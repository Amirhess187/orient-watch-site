import { useEffect, useState } from "react";
import "./Loader.css";

const MIN_VISIBLE_MS = 500;
// A true last resort (e.g. a request that never settles) — not a normal-path
// cap. Frame loads always eventually resolve (errors still count toward
// progress), so this should essentially never fire in practice.
const FALLBACK_MS = 45000;
const EXIT_DURATION_MS = 500;
const READY_THRESHOLD = 0.98;

export default function Loader({ progress }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    const fallbackTimer = setTimeout(() => setForceReady(true), FALLBACK_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
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
        <div className="loader__bar">
          <div className="loader__bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
