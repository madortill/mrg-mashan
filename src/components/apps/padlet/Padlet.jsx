import { useState, useRef, useCallback, useEffect } from "react";
import Padletfull from "../../../assets/images/padletLogofull.png";
import PadletImg from "../../../assets/images/apps/padlet.png";
import BGPadlet from "../../../assets/images/BGPadlet.png";
import "./Padlet.css";

// ---------------------------------------------------------------------------
// Initial note data — positions are percentages of the "screen" overlay area,
// so they stay put relative to the laptop screen at any viewport size.
// Edit `text`, `title`, or `top/left` below to match your real content exactly.
// ---------------------------------------------------------------------------
const INITIAL_NOTES = [
  {
    id: "note-1",
    title: null,
    text: `בכל בוקר מרכז הגיוס בונה ומפיץ דו"חות שונים ע"מ לסייע לקציני המשאן המילואים שבשגרה. בחלק מהפיקודים יישלח בנוסף לדוחות הטבלה מתכללת עם כלל החריגויות לפי החטיבות.`,
    top: 14,
    left: 6,
    width: 40,
  },
  {
    id: "note-2",
    title: null,
    text: `על כל קצין משאן מילואים להיכנס לכל דו”ח לסנן ליחידות שלו ולטפל בחריגויות השונות ולהחזיר התייחסויות למר”ג בסטטוס החריגות `,
    top: 14,
    left: 52,
    width: 40,
  },
  {
    id: "note-3",
    title: null,
    text: `דו”חות יומיים (שמ”פ , מוקפאים, חו”ל)- יופקו כל יום ממענרכת הינשוף על ידי ק' משאן מילואים ויישמרו בתיקיית רשת. יודפסו בשת חירום בלבד. יש לשמור את הדוח של אותו היום. `,
    top: 54,
    left: 6,
    width: 40,
  },
  {
    id: "note-4",
    title: "בעצרת הדוחות -",
    text: `הצח לאוגנדה, הצח מהאוגנדה הצח לפטור ושיבוץ חזוי נוכל לראות מהן תנועות כ"א שעתידות לקרות ביחידות שלנו והלהיערך לקראת בהתאם.`,
    top: 54,
    left: 52,
    width: 40,
  },
  {
    id: "note-5",
    title: null,
    text: `הדו"חות יעזרו לבצע בקרה ומעקב שליטה כ"א.`,
    top: 30,
    left: 68,
    width: 26,
    small: true,
  },
];

let noteIdCounter = INITIAL_NOTES.length + 1;

const Padlet = ({ onComplete }) => {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const screenRef = useRef(null);
  const dragState = useRef(null);

  // Trigger the one orchestrated entrance animation on mount.
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handlePointerDown = useCallback((e, id) => {
    // Ignore drags started on the note's own action buttons.
    if (e.target.closest(".sticky-note__btn")) return;

    const screenEl = screenRef.current;
    if (!screenEl) return;
    const screenRect = screenEl.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;

    const note = notes.find((n) => n.id === id);
    if (!note) return;

    dragState.current = {
      id,
      startX: point.clientX,
      startY: point.clientY,
      startTop: note.top,
      startLeft: note.left,
      screenWidth: screenRect.width,
      screenHeight: screenRect.height,
    };

    setActiveId(id);
    // Bring the dragged note to the front visually.
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.push(item);
      return copy;
    });

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
  }, [notes]);

  const handlePointerMove = useCallback((e) => {
    const drag = dragState.current;
    if (!drag) return;
    if (e.touches) e.preventDefault();

    const point = e.touches ? e.touches[0] : e;
    const dxPct = ((point.clientX - drag.startX) / drag.screenWidth) * 100;
    const dyPct = ((point.clientY - drag.startY) / drag.screenHeight) * 100;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === drag.id
          ? {
              ...n,
              left: clamp(drag.startLeft + dxPct, 0, 100 - n.width),
              top: clamp(drag.startTop + dyPct, 0, 92),
            }
          : n
      )
    );
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setActiveId(null);
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("touchmove", handlePointerMove);
    window.removeEventListener("touchend", handlePointerUp);
  }, [handlePointerMove]);

  const closeNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const duplicateNote = (id) => {
    setNotes((prev) => {
      const original = prev.find((n) => n.id === id);
      if (!original) return prev;
      const copy = {
        ...original,
        id: `note-${noteIdCounter++}`,
        top: clamp(original.top + 4, 0, 92),
        left: clamp(original.left + 4, 0, 100 - original.width),
      };
      return [...prev, copy];
    });
  };

   return (
    <section className="padlet-page" dir="rtl">
      <header className="padlet-header">
        <div className="padlet-header__brand">
          <img src={Padletfull} alt="מדור טכ״ל — קריית ההדרכה" className="padlet-header__logo" />
        </div>
      </header>
 
      <div className="padlet-scene">
        <div
          className="padlet-scene__frame"
          style={{ backgroundImage: `url(${BGPadlet})` }}
        >
          <div
            className={`padlet-laptop ${mounted ? "padlet-laptop--in" : ""}`}
            ref={screenRef}
          >
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={[
                  "sticky-note",
                  note.small ? "sticky-note--small" : "",
                  activeId === note.id ? "sticky-note--dragging" : "",
                  mounted ? "sticky-note--in" : "",
                ].join(" ").trim()}
                style={{
                  top: `${note.top}%`,
                  left: `${note.left}%`,
                  width: `${note.width}%`,
                  transitionDelay: mounted ? `${index * 80}ms` : "0ms",
                }}
                onMouseDown={(e) => handlePointerDown(e, note.id)}
                onTouchStart={(e) => handlePointerDown(e, note.id)}
              >
                <div className="sticky-note__bar">
                  <button
                    type="button"
                    className="sticky-note__btn sticky-note__btn--close"
                    onClick={() => closeNote(note.id)}
                    aria-label="סגור פתק"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    className="sticky-note__btn sticky-note__btn--dup"
                    onClick={() => duplicateNote(note.id)}
                    aria-label="שכפל פתק"
                  >
                    ⧉
                  </button>
                  <span className="sticky-note__btn sticky-note__btn--minus" aria-hidden="true">
                    −
                  </span>
                  <span className="sticky-note__grip" aria-hidden="true">
                    ⋮⋮
                  </span>
                </div>
                <div className="sticky-note__body">
                  {note.title && <strong className="sticky-note__title">{note.title} </strong>}
                  {note.text}
                </div>
              </div>
            ))}
 
            {typeof onComplete === "function" && (
              <button
                type="button"
                className="padlet-complete-btn"
                onClick={onComplete}
              >
                המשך
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Padlet;