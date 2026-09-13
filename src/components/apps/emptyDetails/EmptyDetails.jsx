import React, { useState, useRef, useEffect, useCallback } from "react";
import "./EmptyDetails.css";
import emptyDetailsIcon from "../../../assets/images/folder.svg";

/**
 * אייקונים - SVG מוטמעים ידנית (ללא תלות בחבילה חיצונית כמו lucide-react),
 * כדי שהקומפוננטה תרוץ על כל מחשב/סביבה בלי צורך בהתקנת עוד תלויות.
 * כל אייקון מקבל props רגילים של SVG (size, וכו') כמו אייקון של lucide.
 */
const IconBase = ({ size = 20, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

const Cloud = ({ size = 20, fill = "none", strokeWidth = 2 }) => (
  <IconBase size={size} strokeWidth={strokeWidth}>
    <path
      fill={fill}
      d="M17.5 19H6a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 9.5a4.5 4.5 0 0 1 .9 9.5Z"
    />
  </IconBase>
);

const IdCard = ({ size = 20 }) => (
  <IconBase size={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="10.5" r="1.8" />
    <path d="M5.5 16.5c.7-1.6 2-2.5 3.5-2.5s2.8.9 3.5 2.5" />
    <path d="M15 9h4M15 13h4" />
  </IconBase>
);

const Landmark = ({ size = 20 }) => (
  <IconBase size={size}>
    <path d="M3 21h18" />
    <path d="M4 10h16" />
    <path d="M12 3 3 10h18L12 3Z" />
    <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
  </IconBase>
);

const Wallet = ({ size = 20 }) => (
  <IconBase size={size}>
    <path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h-5a3 3 0 0 0 0 6h5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    <circle cx="16" cy="12" r="1" />
  </IconBase>
);

const Phone = ({ size = 20 }) => (
  <IconBase size={size}>
    <path d="M5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2L19 15v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </IconBase>
);

const Mail = ({ size = 20 }) => (
  <IconBase size={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </IconBase>
);

const MapPin = ({ size = 20 }) => (
  <IconBase size={size}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </IconBase>
);

const X = ({ size = 20 }) => (
  <IconBase size={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </IconBase>
);

const HelpCircle = ({ size = 20 }) => (
  <IconBase size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.3 9a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.2 1-1.2 1.9" />
    <circle cx="12" cy="17" r="0.15" fill="currentColor" stroke="currentColor" />
  </IconBase>
);

/**
 * EmptyDetails
 * -----------------------------------------------------------------------
 * משחק "לכידת פריטים": פריטים נופלים מהענן שלמעלה, השחקן מזיז תיקייה
 * בתחתית המסך (עם העכבר, מגע, או מקשי החצים) ואוסף אותם.
 * שני פריטים (טלפון למקרה אסון + חשבון בנק) הם "מיוחדים" - כשנתפסים,
 * נפתח פופ-אפ עם הסבר מלא על הדו"ח הרלוונטי.
 * סה"כ נופלים 5 פריטים. בסיום נפתח פופ-אפ מסכם עם כפתור "המשך"
 * שקורא ל-onComplete ומעביר לקומפוננטה הבאה.
 *
 * רספונסיביות:
 * גודל המגרש (רוחב וגובה) נמדד בזמן אמת עם ResizeObserver, כך שכל
 * חישובי הנפילה/הלכידה מתעדכנים אוטומטית כשה-CSS משנה את הגודל
 * (למשל במעבר למובייל, ראו EmptyDetails.css). השליטה היא עם
 * pointer events כדי לתמוך גם בעכבר וגם במגע.
 *
 * ללא תלויות חיצוניות: כל האייקונים מוגדרים כ-SVG מקומי למעלה, כך
 * שהקובץ רץ על כל מחשב/פרויקט בלי צורך להתקין lucide-react או כל
 * חבילת אייקונים אחרת.
 * -----------------------------------------------------------------------
 */

// שני הדו"חות ה"מיוחדים" - הטקסט המדויק שסופק
const REPORTS = {
  phone: {
    label: "דו\"ח חסרי טלפון למקרה אסון",
    title: "דו\"ח חסרי טלפון למקרה אסון-",
    body: 'דו"ח זה מפרט על החיילים להם יש פרט חסר בכתובת למקרה אסון. על מנת לטפל בדוח זה, יש ליצור קשר עם החייל ולהשלים מולו את הפרטים לכתובת למקרה אסון. לאחר מכן יש להזין את הפרטים במערכת אנשים במסך "עדכון פרטים אישיים".',
  },
  bank: {
    label: "דו\"ח חסרי חשבון בנק",
    title: "דו\"ח חסרי חשבון בנק-",
    body: 'דו"ח זה מפרט על החיילים להם יש פער בפרטי חשבון בנק, דבר המשפיע על קבלת מענקים והשתתפות בהחזרי הוצאות נסיעה על ביצוע ימי מילואים. קבלת המשכורת איננה נפגעת כי היא לא דרך מופת, אלא דרך ביטוח לאומי. על מנת לטפל בדוח זה, יש ליצור קשר עם החייל ולהשלים מולו את פרטי חשבון הבנק. החייל צריך לשלוח טופס "ניהול חשבון" או כל אסמכתא אחרת המעידה על מספר חשבון הבנק שלו, ולאחר מכן על ק. משא"ן המילואים להזין את חשבון הבנק במערכת אנשים במסך "עדכון פרטים אישיים".',
  },
};

// 5 סוגי הפריטים שנופלים - 2 מיוחדים (עם פופ-אפ) ו-3 רגילים
const ITEM_TYPES = [
  { type: "phone", Icon: IdCard, special: true, label: REPORTS.phone.label },
  { type: "bank", Icon: Landmark, special: true, label: REPORTS.bank.label },
  { type: "wallet", Icon: Wallet, special: false, label: "פרטי חשבון" },
  { type: "mail", Icon: Mail, special: false, label: "כתובת מייל" },
  { type: "address", Icon: MapPin, special: false, label: "כתובת מגורים" },
];

// const TOTAL_ITEMS = ITEM_TYPES.length;
const TOTAL_ITEMS = 10;

const ITEM_SIZE = 52;
const FOLDER_WIDTH = 92;
const FOLDER_HEIGHT = 74;
const CLOUD_Y = 90;
const FALL_SPEED = 90; // פיקסלים לשנייה
const RESPAWN_DELAY = 600; // ms בין תפיסה/פספוס לפריט הבא

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const EmptyDetails = ({ onComplete }) => {
  const containerRef = useRef(null);

  // גודל המגרש בפועל (px) - נמדד דינמית כדי שהמשחק יהיה רספונסיבי אמיתי
  const [boardSize, setBoardSize] = useState({ width: 640, height: 460 });
  const boardSizeRef = useRef(boardSize);

  const [queue, setQueue] = useState(() => shuffle(ITEM_TYPES.map((i) => i.type)));
  const [currentItem, setCurrentItem] = useState(null); // { type, x, y }
  const [collected, setCollected] = useState([]); // array of types, in catch order
  const [folderX, setFolderX] = useState(0);
  const [popup, setPopup] = useState(null); // null | 'phone' | 'bank' | 'final'
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const folderXRef = useRef(folderX);
  const popupRef = useRef(popup);
  const collectedRef = useRef(collected);
  const currentItemRef = useRef(currentItem);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const spawnTimerRef = useRef(null);

  useEffect(() => {
    folderXRef.current = folderX;
  }, [folderX]);
  useEffect(() => {
    popupRef.current = popup;
  }, [popup]);
  useEffect(() => {
    currentItemRef.current = currentItem;
  }, [currentItem]);
  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);
  useEffect(() => {
    boardSizeRef.current = boardSize;
  }, [boardSize]);

  const clampFolder = useCallback(
    (x, width = boardSizeRef.current.width) =>
      Math.min(Math.max(x, 0), Math.max(0, width - FOLDER_WIDTH)),
    []
  );

  // מדידת גודל המגרש בפועל בכל שינוי (resize, מעבר לפריסת מובייל וכו')
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setBoardSize({ width, height });
      setFolderX((x) => clampFolder(x, width));
    });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // שליטה עם עכבר/מגע - מאזין ברמת ה-window (לא רק כשהעכבר בדיוק מעל
  // המגרש), כדי שהתיקייה תוכל להגיע ממש עד הקצה הימני/שמאלי בלי "להיתקע"
  // כשהעכבר זז מהר או יוצא רגע מגבולות התיבה.
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX == null) return;
      const x = clientX - rect.left - FOLDER_WIDTH / 2;
      setFolderX(clampFolder(x));
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
    };
  }, [clampFolder]);

  // שליטה במקלדת (חצים)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setFolderX((x) => clampFolder(x - 28));
      } else if (e.key === "ArrowRight") {
        setFolderX((x) => clampFolder(x + 28));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clampFolder]);

  // ---- ספאון של הפריט הבא ----
  const spawnNext = useCallback(() => {
    setQueue((q) => {
      if (q.length === 0) return q;
      const [nextType, ...rest] = q;
      const meta = ITEM_TYPES.find((i) => i.type === nextType);
      const maxX = Math.max(0, boardSizeRef.current.width - ITEM_SIZE);
      setCurrentItem({
        type: meta.type,
        x: Math.random() * maxX,
        y: CLOUD_Y,
      });
      return rest;
    });
  }, []);

  useEffect(() => {
    if (currentItem === null && popup === null && queue.length > 0) {
      spawnTimerRef.current = setTimeout(spawnNext, RESPAWN_DELAY);
      return () => clearTimeout(spawnTimerRef.current);
    }
    if (currentItem === null && popup === null && queue.length === 0 && collected.length === TOTAL_ITEMS) {
      setPopup("final");
    }
  }, [currentItem, popup, queue, collected.length, spawnNext]);

  // ---- לולאת האנימציה: נפילה + זיהוי לכידה/פספוס ----
  useEffect(() => {
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (currentItemRef.current && popupRef.current === null) {
        setCurrentItem((item) => {
          if (!item) return item;
          const { width, height } = boardSizeRef.current;
          const newY = item.y + FALL_SPEED * dt;
          const folderTop = height - FOLDER_HEIGHT - 6;
          const itemBottom = newY + ITEM_SIZE;

          const overlapsX =
            item.x + ITEM_SIZE > folderXRef.current &&
            item.x < folderXRef.current + FOLDER_WIDTH;

          // לכידה
          if (itemBottom >= folderTop && overlapsX) {
            const meta = ITEM_TYPES.find((i) => i.type === item.type);
            setCollected((c) => [...c, item.type]);
            if (meta.special) {
              setPopup(item.type);
            }
            return null;
          }

          // פספוס - חוזר לענן עם מיקום X חדש
          if (newY > height) {
            const maxX = Math.max(0, width - ITEM_SIZE);
            return { ...item, y: CLOUD_Y, x: Math.random() * maxX };
          }

          return { ...item, y: newY };
        });
      }

      rafRef.current = requestAnimationFrame(step);
    };
    // חשוב: אין תלות ב-currentItem כאן. הלולאה רצה ברצף מהעלייה ועד ההסרה
    // של הקומפוננטה, וקוראת את הפריט העדכני דרך currentItemRef. קודם
    // הלולאה הייתה נטענת מחדש בכל פריים (כי currentItem משתנה כל פריים),
    // מה שאיפס את שעון הזמן (lastTsRef) שוב ושוב וגרם לנפילה איטית/תקועה
    // בלי קשר לערך של FALL_SPEED.
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, []);

  const closePopup = () => {
    const wasSpecialClosing = popup !== "final";
    setPopup(null);
    setTooltipOpen(false);
    if (wasSpecialClosing && collectedRef.current.length === TOTAL_ITEMS) {
      // כל הפריטים כבר נאספו והפריט האחרון היה מיוחד - נעבור ישר לפופ-אפ מסכם
      setTimeout(() => setPopup("final"), 200);
    }
  };

  const progress = collected.length;

  return (
    <div dir="rtl" className="ed-wrapper">
      <div className="ed-board-column">
        <div className="ed-hint">הזיזי את התיקייה עם העכבר, מגע, או החצים ←→</div>
        <div
          className="ed-board"
          ref={containerRef}
        >
          <div className="ed-cloud">
            <Cloud size={78} strokeWidth={1.3} fill="#e9eff5" />
          </div>

          {currentItem &&
            (() => {
              const meta = ITEM_TYPES.find((i) => i.type === currentItem.type);
              const Icon = meta.Icon;
              return (
                <div
                  className="ed-item"
                  style={{ left: currentItem.x, top: currentItem.y }}
                >
                  <Icon size={26} />
                </div>
              );
            })()}

          <div className="ed-folder" style={{ left: folderX }}>
            <img src={emptyDetailsIcon} alt="תיקייה" draggable={false} />
          </div>
        </div>
      </div>

      <div className="ed-side">
        <h3>מה אספנו</h3>
        <div className="ed-side-list">
          {ITEM_TYPES.map(({ type, Icon, label }) => {
            const isCollected = collected.includes(type);
            return (
              <div
                key={type}
                className="ed-side-row"
                style={{ opacity: isCollected ? 1 : 0.35 }}
              >
                <div className="ed-side-icon">
                  <Icon size={18} />
                </div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="ed-progress">נאספו {progress} מתוך {TOTAL_ITEMS} פריטים</div>
      </div>

      {(popup === "phone" || popup === "bank") && (
        <div className="ed-overlay">
          <div className="ed-popup">
            <button className="ed-popup-close" onClick={closePopup} aria-label="סגירה">
              <X size={18} />
            </button>
            <h4>{REPORTS[popup].title}</h4>
            <p>{REPORTS[popup].body}</p>
            <div className="ed-help-wrap">
              <button
                className="ed-help-btn"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onClick={() => setTooltipOpen((v) => !v)}
                aria-label="עזרה"
              >
                <HelpCircle size={18} />
              </button>
              {tooltipOpen && (
                <div className="ed-tooltip">
                  <div className="ed-tooltip-placeholder">תמונת טבלה תתווסף כאן</div>
                  מקום לתמונת ההסבר שתצורף בהמשך
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {popup === "final" && (
        <div className="ed-overlay">
          <div className="ed-popup">
            <h4>דוחות חסרי פרטים לחיילים</h4>
            <div className="ed-final-list">
              {Object.values(REPORTS).map((r) => (
                <div className="ed-final-item" key={r.label}>
                  {r.label}
                </div>
              ))}
            </div>
            <button className="ed-final-btn" onClick={() => onComplete && onComplete()}>
              המשך
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyDetails;