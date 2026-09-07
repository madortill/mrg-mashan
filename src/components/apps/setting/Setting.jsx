import { useState, useRef, useEffect } from "react";
import "./Setting.css";
import settingIcon from "../../../assets/images/apps/setting.svg";

const ROWS = [
  {
    title: "תקינות נקודות קליטה",
    text: `כל תקופת זמן, עפ"י הגדרת המר"ג, ק' משא"ן מילואים צריך לבצע בדיקת תקינות נק' הקליטה ולהעביר דו"ח למר"ג ואחריות המר"ג לטפל בתקלות במידה ויש.`,
  },
  {
    title: "כוננות חגים",
    text: ' כגון: דרכ"ש אוגדתי/פיקודי, סד"פ למש"ק ולקצין משא"ן מיל, פורמט מעקב רשתות קריאה וכו',
  },
  {
    title: "תיקוף מסמכים לשעת חירום",
    text: 'בתקופת חגי ישראל, כגון: סוכות, פסח וכו, מרכז הגיוס דורש מהיחידות לבצע בדיקה עם אנשי רשתות הקריאה המהירות, מפקדים ורקמה, האם נוכחים בארץ בתקופה זו ובמידה ולא מי המחליף שלהם. בנוסף על מסמך זה צריך להיות חתום מפקד בדרגת סא"ל ומעלה.',
  },
];

// How many diagonal bars sit on each side once a row is fully open.
const BAR_COUNT = 4;

// How long the reveal / collapse animation runs before the open/closed
// state is actually persisted via onPageChange.
const ANIMATION_DURATION_MS = 900;

const Bars = ({ count }) =>
  Array.from({ length: count }).map((_, i) => (
    <span key={i} className="setting-row__bar-item" style={{ "--i": i }} />
  ));

const Setting = ({ page = 0, onPageChange, onComplete, onNext }) => {
  const openedMask = page; // page itself is the bitmask of which rows are open
  // Only visual/local: which row is mid-animation, and in which direction.
  const [pending, setPending] = useState(null); // { index, action: 'opening' | 'closing' }
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const isOpen = (i) => (openedMask & (1 << i)) !== 0;
  const allOpen = openedMask === (1 << ROWS.length) - 1;

  const handleRowClick = (i) => {
    if (pending) return; // only one row animates at a time

    const currentlyOpen = isOpen(i);
    const action = currentlyOpen ? "closing" : "opening";
    setPending({ index: i, action });

    timeoutRef.current = setTimeout(() => {
      setPending(null);
      const nextMask = currentlyOpen
        ? openedMask & ~(1 << i)
        : openedMask | (1 << i);
      onPageChange?.(nextMask);
    }, ANIMATION_DURATION_MS);
  };

  const handleConfirm = () => {
    if (!allOpen) return;
    // Prefer onNext so finishing Setting chains straight into the next
    // app (e.g. NewsToday) instead of forcing a return to the hub.
    if (typeof onNext === "function") onNext();
    else onComplete?.();
  };

  return (
    <div className="setting-page">
      <div className="setting-card">
        <div className="setting-card__header">
          <span className="setting-card__title">SETTINGS</span>
          <img src={settingIcon} alt="" className="setting-card__icon" />
        </div>

        <p className="setting-card__subtitle">
          לחצו כדי לקבל את הנתונים שנתעדכנו לאחרונה
        </p>

        <div className="setting-card__rows">
          {ROWS.map((row, i) => {
            const persistedOpen = isOpen(i);
            const isPendingThis = pending?.index === i;
            // While mid-animation the visual state leads the persisted
            // state; otherwise it just reflects what's been saved.
            const visible = isPendingThis
              ? pending.action === "opening"
              : persistedOpen;

            return (
              <div
                key={i}
                className={[
                  "setting-row",
                  visible ? "setting-row--open" : "",
                  isPendingThis ? "setting-row--animating" : "",
                ].join(" ").trim()}
                onClick={() => handleRowClick(i)}
                role="button"
                tabIndex={0}
                aria-expanded={visible}
              >
                <div className="setting-row__bar">
                  <span
                    className="setting-row__bars setting-row__bars--right"
                    aria-hidden="true"
                  >
                    <Bars count={BAR_COUNT} />
                  </span>

                  <span
                    key={visible ? "body" : "title"}
                    className="setting-row__label"
                  >
                    {visible ? row.text : row.title}
                  </span>

                  <span
                    className="setting-row__bars setting-row__bars--left"
                    aria-hidden="true"
                  >
                    <Bars count={BAR_COUNT} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={`setting-confirm-pill ${allOpen ? "is-active" : ""}`}
          onClick={handleConfirm}
          disabled={!allOpen}
        >
          100%
        </button>
      </div>
    </div>
  );
};

export default Setting;