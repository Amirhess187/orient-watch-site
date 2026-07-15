import { useEffect, useState } from "react";
import "./Loader.css";

const MIN_VISIBLE_MS = 500;
const FALLBACK_MS = 6000;
const EXIT_DURATION_MS = 500;

export default function Loader({ ready }) {
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

  useEffect(() => {
    if (!minTimeElapsed || !(ready || forceReady)) return;

    let cancelled = false;
    Promise.resolve(document.fonts?.ready).finally(() => {
      if (!cancelled) setExiting(true);
    });

    return () => {
      cancelled = true;
    };
  }, [minTimeElapsed, ready, forceReady]);

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

  return (
    <div className={`loader ${exiting ? "loader--exit" : ""}`} aria-hidden="true">
      <span className="loader__mark">ا</span>
    </div>
  );
}
