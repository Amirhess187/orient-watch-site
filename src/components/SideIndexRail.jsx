import { useActiveSection } from "../lib/useActiveSection";
import "./SideIndexRail.css";

const MARKS = [
  { mark: "I", id: "oceanus" },
  { mark: "II", id: "sylva" },
  { mark: "III", id: "ignis" },
  { mark: "IV", id: "contact" },
];

const SECTION_IDS = MARKS.map((item) => item.id);

export default function SideIndexRail() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <div className="side-rail" aria-hidden="true">
      <div className="side-rail__line" />
      {MARKS.map((item) => (
        <span
          className={`side-rail__mark ${
            activeId === item.id ? "side-rail__mark--active" : ""
          }`}
          key={item.mark}
        >
          {item.mark}
        </span>
      ))}
    </div>
  );
}
