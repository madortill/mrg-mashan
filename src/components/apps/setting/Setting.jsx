import { useState, useRef, useEffect } from "react";
import "./Setting.css";
import settingIcon from "../../../assets/images/apps/setting.svg";

const ROWS = [
  {
    title: "תקינות בקרת קליטה",
    text: 'כל תקופה עוברת עם הודרכת חיי"ר, קן פעמים מקבצת בדיקת תקינות ומעדכן דוח לטווח. (מאתה תפריט תקבל בהקלד אם ישנה).',
  },
  {
    title: "כמות חרים",
    text: 'כל תקופה עוברת עם הודרכת חיי"ר, קן פעמים מקבצת בדיקת תקינות ומעדכן דוח לטווח. (מאתה תפריט תקבל בהקלד אם ישנה).',
  },
  {
    title: "תיקוף ממשכים לשעת חירום",
    text: 'כל תקופה עוברת עם הודרכת חיי"ר, קן פעמים מקבצת בדיקת תקינות ומעדכן דוח לטווח. (מאתה תפריט תקבל בהקלד אם ישנה).',
  },
];

const LOADING_DURATION_MS = 900;

const Setting = ({ page = 0, onPageChange, onComplete }) => {
  const openedMask = page; // ⭐ page עצמו הוא ה-bitmask
  const [loadingIndex, setLoadingIndex] = useState(null); // רק ויזואלי, לא persist
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const isOpen = (i) => (openedMask & (1 << i)) !== 0;
  const allOpen = openedMask === (1 << ROWS.length) - 1;

  const handleRowClick = (i) => {
    if (isOpen(i) || loadingIndex !== null) return; // כבר פתוח, או שורה אחרת בטעינה

    setLoadingIndex(i);
    timeoutRef.current = setTimeout(() => {
      setLoadingIndex(null);
      onPageChange?.(openedMask | (1 << i)); // ⭐ שומרים למעלה - זה מה ש"נזכר"
    }, LOADING_DURATION_MS);
  };

  const handleConfirm = () => {
    if (!allOpen) return;
    onComplete?.();
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
            const open = isOpen(i);
            const loading = loadingIndex === i;

            return (
              <div
                key={i}
                className={[
                  "setting-row",
                  open ? "setting-row--open" : "",
                  loading ? "setting-row--loading" : "",
                ].join(" ").trim()}
                onClick={() => handleRowClick(i)}
                role="button"
                tabIndex={0}
                aria-expanded={open}
              >
                <div className="setting-row__bar">
                  <span className="setting-row__title">{row.title}</span>
                  <span className="setting-row__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        d="M8 5l6 7-6 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {loading && <span className="setting-row__loading-fill" />}
                </div>

                {open && (
                  <p className="setting-row__text">{row.text}</p>
                )}
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