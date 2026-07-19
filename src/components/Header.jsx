import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useActiveSection } from "../lib/useActiveSection";
import "./Header.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { href: "#oceanus", id: "oceanus", label: "اقیانوس" },
  { href: "#sylva", id: "sylva", label: "جنگل" },
  { href: "#ignis", id: "ignis", label: "آتشفشان" },
  { href: "#contact", id: "contact", label: "تماس" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const activeId = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const el = headerRef.current;
    const trigger = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom top",
      onEnter: () => el.classList.add("site-header--solid"),
      onLeaveBack: () => el.classList.remove("site-header--solid"),
    });

    return () => trigger.kill();
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header__inner container">
        <a href="#top" className="brand" aria-label="اورینت، بازگشت به بالای صفحه">
          <span className="brand__name">Orient</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        <nav
          id="primary-nav"
          className={`primary-nav ${open ? "primary-nav--open" : ""}`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeId === link.id ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
