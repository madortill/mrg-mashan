import { useState, useRef, useEffect } from "react";
import "./Setting.css";
import settingIcon from "../../../assets/images/apps/setting.svg";

const ROWS = [
  {
    title: "תקינות נקודות קליטה",
    text: `כל תקופת זמן, עפ"י הגדרת המר"ג, ק' משא"ן מילואים צריך לבצע בדיקת תקינות נק' הקליטה ולהעביר דו"ח למר"ג ואחריות המר"ג לטפל בתקלות במידה ויש.`,
  },
  {
    title: "תיקוף מסמכים לשעת חירום", // תוקן: התוכן הותאם לכותרת הנכונה מהתמונה
    text: `כגון: דרכ"ש אוגדתי/פיקודי, סד"פ למש"ק ולקצין משא"ן מיל, פורמט מעקב רשתות קריאה וכו'`,
  },
  {
    title: "כוננות חגים", // תוקן: התוכן הותאם לכותרת הנכונה מהתמונה
    text: `בתקופת חגי ישראל, כגון: סוכות, פסח וכו, מרכז הגיוס דורש מהיחידות לבצע בדיקה עם אנשי רשתות הקריאה המהירות, מפקדים ורקמה, האם נוכחים בארץ בתקופה זו ובמידה ולא מי המחליף שלהם. בנוסף על מסמך זה צריך להיות חתום מפקד בדרגת סא"ל ומעלה.`,
  },
];

const BAR_COUNT = 4;
const ANIMATION_DURATION_MS = 900;

const Bars = ({ count }) =>
  Array.from({ length: count }).map((_, i) => (
    <span key={i} className="setting-row__bar-item" style={{ "--i": i }} />
  ));

const Setting = ({ page = 0, onPageChange, onComplete, onNext }) => {
  const openedMask = page; 
  
  // State חדש שעוקב אחרי כל השורות שאי פעם נפתחו במהלך הסיבוב הזה
  const [historyMask, setHistoryMask] = useState(page);
  
  const [pending, setPending] = useState(null); 
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // מעדכן את היסטוריית הפתיחות במידה וערך ה-page מגיע מבחוץ עם שורות פתוחות
  useEffect(() => {
    setHistoryMask((prev) => prev | page);
  }, [page]);

  const isOpen = (i) => (openedMask & (1 << i)) !== 0;
  
  // התנאי החדש: הכפתור יופעל אם כל השורות קיימות בביטמאסק של ההיסטוריה
  const targetMask = (1 << ROWS.length) - 1;
  const wasEverythingOpened = historyMask === targetMask;

  const handleRowClick = (i) => {
    if (pending) return; 

    const currentlyOpen = isOpen(i);
    const action = currentlyOpen ? "closing" : "opening";
    setPending({ index: i, action });

    // אם השורה נפתחת כעת, נעדכן מיד את ההיסטוריה כדי שהחיווי של ה-100% יוכל להגיב מהר
    if (action === "opening") {
      setHistoryMask((prev) => prev | (1 << i));
    }

    timeoutRef.current = setTimeout(() => {
      setPending(null);
      const nextMask = currentlyOpen
        ? openedMask & ~(1 << i)
        : openedMask | (1 << i);
      onPageChange?.(nextMask);
    }, ANIMATION_DURATION_MS);
  };

  const handleConfirm = () => {
    if (!wasEverythingOpened) return;
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
          -לחצו כדי לטעון את הנושאים שנתקעו-
        </p>

        <div className="setting-card__rows">
          {ROWS.map((row, i) => {
            const persistedOpen = isOpen(i);
            const isPendingThis = pending?.index === i;
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
          className={`setting-confirm-pill ${wasEverythingOpened ? "is-active" : ""}`}
          onClick={handleConfirm}
          disabled={!wasEverythingOpened}
        >
          100%
        </button>
      </div>
    </div>
  );
};

export default Setting;
