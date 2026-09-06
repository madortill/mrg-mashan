import { useRef, useState, useCallback } from "react";
import "./Chatgpt.css";
import chatIcon from "../../../assets/images/apps/chatgpt.png";

// כל בלוק הוא הודעת עוזר אחת. heading הוא כותרת מודגשת (אופציונלי),
// paragraphs הם שורות הטקסט מתחתיו.
const messageBlocks = [
  {
    heading: null,
    paragraphs: [
      'אז ביקשת שאסביר על שינוי איוש בנ"ל בחיילי מילואים בנקודות בצורה פשוטה וברורה, כך שילד בן 4 יוכל להבין:',
    ],
  },
  {
    heading: "הקדמה",
    paragraphs: ["מרכז הגיוס מפיק בכל יום דוח בלתי נקראים."],
  },
  {
    heading: 'סוגי דוחות בנ"ל',
    paragraphs: [
      'יש שני סוגי דוחות לבנ"ל שכל קצין משא"ן מילואים נדרש להפיק:',
      "בקרת בלתי נקראים – כל מי שבלתי נקרא ביחידה, ככה אפשר להיות במעקב.",
      'דוח פוטנציאל בלתי נקראים – כל מי שצריך להיות בבנ"ל והוא לא.',
    ],
  },
  {
    heading: "הסבר",
    paragraphs: [
      'מידי יום מרכז הגיוס מפיק מהינשוף פוטנציאל בנ"ל, שם יוצגו כל מי שצריך להיות בעל סוג איוש \'בלתי נקרא\', אך טרם שובץ מהסיבות הבאות - חריגי ייעוד, חודשון תורן, תת"ש מילואים, הריון וחופשת לידה, וע"ר קב"ן, שינוי פרופיל (24/21), עריק מהיום ה-21 לנפקדות ונפטרים.',
      'בהתאם, קצין משא"ן המילואים משנה את סוג האיוש של חייל המילואים לסוג איוש בלתי נקרא.',
    ],
  },
  {
    heading: "לכל כלל יש יוצא מן הכלל!",
    paragraphs: ["ישנם מקרים בהם החייל יאויש אוטומטית בסוג איוש בלתי נקרא."],
  },
];

const CONFIRM_LABEL = "הבנתי צ'אט";
const SCROLL_END_THRESHOLD = 24; // פיקסלים - כמה "קרוב לסוף" נחשב מספיק

const Chatgpt = ({ onComplete }) => {
  const [reachedEnd, setReachedEnd] = useState(false);
  const [sent, setSent] = useState(false);
  const bodyRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (reachedEnd) return; // אין צורך לבדוק שוב אחרי שהגענו לסוף פעם אחת
    const el = bodyRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom <= SCROLL_END_THRESHOLD) {
      setReachedEnd(true);
    }
  }, [reachedEnd]);

  const handleSend = () => {
    if (sent) return;
    setSent(true);
  };

  const handleAnimationEnd = () => {
    // ⭐ מתקדמים רק אחרי שאנימציית שליחת ההודעה הסתיימה בפועל
    onComplete?.();
  };

  return (
    <div className="chatgpt-page">
      <div className="chatgpt-card">
        <div className="chatgpt-card__header">
          <span className="chatgpt-card__title">ChatGPT</span>
          <img src={chatIcon} alt="ChatGPT" className="chatgpt-card__icon" />
        </div>

        <div
          className="chatgpt-card__body"
          ref={bodyRef}
          onScroll={handleScroll}
        >
          {messageBlocks.map((block, i) => (
            <div className="chatgpt-message" key={i}>
              {block.heading && (
                <h4 className="chatgpt-message__heading">{block.heading}</h4>
              )}
              {block.paragraphs.map((p, j) => (
                <p className="chatgpt-message__text" key={j}>
                  {p}
                </p>
              ))}
            </div>
          ))}

          {sent && (
            <div
              className="chatgpt-message chatgpt-message--user"
              onAnimationEnd={handleAnimationEnd}
            >
              <span className="chatgpt-bubble">{CONFIRM_LABEL}</span>
            </div>
          )}
        </div>

        <div className="chatgpt-card__footer">
          <button type="button" className="chatgpt-icon-btn" aria-label="עזרה">
            ?
          </button>

          {reachedEnd && !sent && (
            <button
              type="button"
              className="chatgpt-confirm-pill"
              onClick={handleSend}
            >
              {CONFIRM_LABEL}
            </button>
          )}

          <button type="button" className="chatgpt-icon-btn" aria-label="הוספה">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatgpt;