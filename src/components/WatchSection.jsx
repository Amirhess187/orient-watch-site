import { useRef } from "react";
import { useScrollReveal } from "../lib/useScrollReveal";
import "./WatchSection.css";

export default function WatchSection({ watch, reverse = false }) {
  const textRef = useRef(null);
  const mediaRef = useRef(null);
  useScrollReveal(textRef);
  useScrollReveal(mediaRef, { delay: 0.1 });

  const style = {
    "--section-base": `var(${watch.baseVar})`,
    "--section-accent": `var(${watch.accentVar})`,
  };

  return (
    <section
      id={watch.id}
      className={`watch-section ${reverse ? "watch-section--reverse" : ""}`}
      style={style}
    >
      <div className="watch-section__glow" aria-hidden="true" />

      <div className="watch-section__inner container">
        <div ref={textRef} className="watch-section__text">
          <span className="section-label watch-section__eyebrow">
            {watch.eyebrow}
          </span>
          <h2 className="watch-section__title">{watch.name}</h2>
          <p className="watch-section__tagline">{watch.tagline}</p>
          <p className="watch-section__story">{watch.story}</p>
          <span className="watch-section__price">{watch.price}</span>
        </div>

        <div ref={mediaRef} className="watch-section__media">
          <div className="watch-section__media-frame">
            <img
              className="watch-section__media-photo"
              src={`${watch.media}watch.png`}
              alt={`ساعت ${watch.name}`}
              loading="lazy"
            />
            <span className="watch-section__media-index">{watch.index}</span>
          </div>

          <div className="watch-section__specs">
            {watch.specs.map((spec) => (
              <div className="spec-card" key={spec.label}>
                <span className="spec-card__label">{spec.label}</span>
                <strong className="spec-card__value">{spec.value}</strong>
                <span className="spec-card__detail">{spec.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
