import { useRef } from "react";
import { useScrollReveal } from "../lib/useScrollReveal";
import "./OutroSection.css";

export default function OutroSection() {
  const textRef = useRef(null);
  useScrollReveal(textRef);

  return (
    <section className="outro-section">
      <div ref={textRef} className="outro-section__content">
        <span className="section-label">اورینت — ۲۰۲۶</span>
        <h2 className="outro-section__title">
          اقیانوس، جنگل، آتشفشان؛
          <br />
          سه عنصر طبیعت، یک ساعت اورینت.
        </h2>
      </div>
    </section>
  );
}
