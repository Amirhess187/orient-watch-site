import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./CustomCursor.css";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, [role='button'], .spec-card";
const ACTIVE_SCALE = 1.35;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setEnabled(canHover && !reduceMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    document.body.classList.add("custom-cursor-active");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const handleMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const handleOver = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.add("custom-cursor__ring--active");
        gsap.to(ring, { scale: ACTIVE_SCALE, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleOut = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.remove("custom-cursor__ring--active");
        gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleDown = () => {
      gsap.to([dot, ring], { scale: 0.8, duration: 0.15, ease: "power2.out" });
    };

    const handleUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.15, ease: "power2.out" });
      const isActive = ring.classList.contains("custom-cursor__ring--active");
      gsap.to(ring, {
        scale: isActive ? ACTIVE_SCALE : 1,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleLeaveWindow = () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    const handleEnterWindow = () => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeaveWindow);
    document.documentElement.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", handleEnterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor__ring" aria-hidden="true">
        <span className="custom-cursor__tick custom-cursor__tick--12" />
        <span className="custom-cursor__tick custom-cursor__tick--3" />
        <span className="custom-cursor__tick custom-cursor__tick--6" />
        <span className="custom-cursor__tick custom-cursor__tick--9" />
        <span className="custom-cursor__hand" />
      </div>
      <div ref={dotRef} className="custom-cursor__dot" aria-hidden="true" />
    </>
  );
}
