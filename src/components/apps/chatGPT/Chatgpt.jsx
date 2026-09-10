import { useRef, useState, useCallback, useEffect } from "react";
import "./Chatgpt.css";
import chatIcon from "../../../assets/images/apps/chatgpt.png";

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
const SCROLL_END_THRESHOLD = 24;

const Chatgpt = ({ page, onPageChange, onComplete }) => {
  // ⭐ sent נגזר מהאב: אם page שווה ל-1 זה אומר שההודעה כבר נשלחה בעבר
  const sent = page === 1;
  
  // נשמור משתנה מקומי ב-ref כדי לדעת אם העמוד נטען כשההודעה *כבר* הייתה שלוחה
  // אם הוא נכנס כשההודעה כבר שלוחה, value בטעינה יהיה true ונדע שזו כניסה חוזרת
  const isReturnVisit = useRef(sent);

  const [reachedEnd, setReachedEnd] = useState(sent);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (sent && bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: isReturnVisit.current ? "auto" : "smooth", 
      });
    }
  }, [sent]);

  const handleScroll = useCallback(() => {
    if (reachedEnd) return;
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
    
    onPageChange?.(1); // מעדכן את האב שההודעה נשלחה

    // ⭐ אם זו הפעם הראשונה (הוא לא הגיע לפה כשההודעה כבר שלוחה), נצא אוטומטית אחרי שנייה וחצי
    if (!isReturnVisit.current) {
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    }
  };

  const handleNextStep = () => {
    if (sent) {
      onComplete?.();
    }
  };

  // תנאי לקביעה האם החץ צריך להבהב: רק אם ההודעה שלוחה וזו כניסה חוזרת לעמוד
  const shouldBlink = sent && isReturnVisit.current;

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
            <div className="chatgpt-message chatgpt-message--user">
              <span className="chatgpt-bubble">{CONFIRM_LABEL}</span>
            </div>
          )}

          <div style={{ height: "50px", flexShrink: 0 }} />
        </div>

        <div className="chatgpt-card__footer-container">
          <div className="chatgpt-input-wrapper">
            <button type="button" className="chatgpt-input-plus" aria-label="הוספה">
              +
            </button>
            
            <div className="chatgpt-mock-input">
              {!sent && !reachedEnd && (
                <span className="chatgpt-placeholder">גלול מטה כדי לאשר את תוכן הצ'אט...</span>
              )}
              {!sent && reachedEnd && (
                <span className="chatgpt-placeholder">לחץ על הבלון הצף למטה כדי לאשר</span>
              )}
              {sent && (
                <span className="chatgpt-input-text-filled">
                  תסביר לי על שינוי איוש בנ"ל בחיילי מילואים בצורה פשוטה
                </span>
              )}
            </div>

            {/* ⭐ החץ יקבל מחלקה מיוחדת להבהוב במידה וזו כניסה חוזרת */}
            <button 
              type="button" 
              className={`chatgpt-submit-circle-btn ${sent ? 'chatgpt-submit-circle-btn--active' : ''} ${shouldBlink ? 'chatgpt-submit-circle-btn--blink' : ''}`} 
              onClick={handleNextStep}
              disabled={!sent}
              aria-label="המשך לשלב הבא"
            >
              ↑
            </button>
          </div>
        </div>

        {reachedEnd && !sent && (
          <button
            type="button"
            className="chatgpt-confirm-floating-pill"
            onClick={handleSend}
          >
            {CONFIRM_LABEL}
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatgpt;
