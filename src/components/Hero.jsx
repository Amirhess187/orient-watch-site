import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFrameSequence from "./ScrollFrameSequence";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const el = scrollIndicatorRef.current;
    const trigger = ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      end: "+=150",
      onEnter: () => el.classList.add("hero__scroll-indicator--hidden"),
      onLeaveBack: () => el.classList.remove("hero__scroll-indicator--hidden"),
    });

    return () => trigger.kill();
  }, []);
  const introContent = (
    <div className="hero__intro">
      <span className="section-label">۰۰۰ — کالکشن ۲۰۲۶</span>
      <h1 className="hero__intro-title">
        سه ساعت.
        <br />
        سه عنصر طبیعت.
      </h1>
    </div>
  );

  const beats = [
    {
      key: "tagline",
      start: 0.42,
      end: 0.72,
      side: "left",
      content: (
        <div className="hero__beat">
          <p className="hero__tagline">
            اورینت با کالکشنی تازه و محدود، روح دریا، جنگل و آتشفشان را روی
            مچ شما می‌نشاند؛ ساخته‌شده برای آن‌ها که سکوت را در جزئیات
            می‌جویند.
          </p>
          <a className="hero__cta" href="#oceanus">
            مشاهدهٔ کالکشن
          </a>
        </div>
      ),
    },
  ];

  return (
    <ScrollFrameSequence
      id="top"
      framesBase="/media/hero/frames/"
      frameCount={192}
      heightVh={340}
      bgColor="#0a0908"
      className="hero"
      introBlack={0.16}
      outroBlack={0.88}
      introContent={introContent}
      beats={beats}
    >
      <div
        ref={scrollIndicatorRef}
        className="hero__scroll-indicator"
        aria-hidden="true"
      >
        <span />
      </div>
    </ScrollFrameSequence>
  );
}
