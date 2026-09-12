// SmsGal.jsx
import { useState, useEffect, useCallback } from "react";
import profilImg from "../../../assets/images/smsImg.svg";
import smsBubbleIcon from "../../../assets/images/sms-icon.svg";
import { CALL_ANSWERED_KEY } from "../calling/Calling.jsx";
import { HOLIDAY_READINESS_PAGE } from "../excel/excelData";
import "./SmsGal.css";

// ---------------------------------------------------------------------------
// טקסטים
// ---------------------------------------------------------------------------
const DECLINE_FOLLOWUP_MESSAGE =
  'שמנו לב שלא עניתם לשיחת מר"ג. לכן, בהתאם לנוהל, אנו מעבירים לכם את הפרטים גם בהודעת SMS:';

const INTRO_MESSAGE =
  'למר"ג היכולת להפיץ הודעות SMS לנייד של חיילי המילואים ע"פ בקשת ק\' משא"ן המילואים. זאת ניתן לבצע לאחר אישור ב"מ + העברת בקשה למר"ג ע"פ פורמט ייעודי:';

// ההודעות שמופיעות בזו אחר זו באנימציית שליחה, אחרי הודעת הפתיחה
const SEQUENTIAL_MESSAGES = [
  "נוכל לתזכר את חיילי המילואים",
  "לברך אותם לקראת החג",
  "להודות על השתתפותם באימון מסוים",
  'להמשך השיבו "הבנתי"',
];

const SENDER_NAME = 'מערכת "גל"';
const SEND_DELAY_MS = 900; // זמן "שולח..." בין הודעה להודעה

const getTimestamp = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

const SmsGal = ({
  page,
  onPageChange,
  onNext,
  onComplete,
  onSpeechChange,
  onJumpToApp,
}) => {
  const step = typeof page === "number" ? page : 0; // 0 = נוטיפיקציה, 1 = צ'אט פתוח
  const setStep = useCallback(
    (next) => {
      if (typeof onPageChange === "function") onPageChange(next);
    },
    [onPageChange]
  );

  const [wasDeclined, setWasDeclined] = useState(false);
  // כמה מתוך SEQUENTIAL_MESSAGES כבר נשלחו/הוצגו בפועל
  const [sentCount, setSentCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [understoodClicked, setUnderstoodClicked] = useState(false);

  // בדיקה חד-פעמית האם המשתמש דחה את השיחה הקודמת (Calling.jsx)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CALL_ANSWERED_KEY);
      setWasDeclined(raw !== null && JSON.parse(raw) === false);
    } catch {
      setWasDeclined(false);
    }
  }, []);

  // טקסט בועה לפי שלב
  useEffect(() => {
    if (typeof onSpeechChange !== "function") return;

    if (step === 0) {
      onSpeechChange('התקבלה הודעת SMS ממערכת "גל" - לחצו כדי לפתוח.');
    } else if (understoodClicked) {
      onSpeechChange('לחצו על הקישור לטבלת הכוננות כדי להמשיך.');
    } else {
      onSpeechChange('עקבו אחר ההודעות הנכנסות ממערכת "גל".');
    }
  }, [step, understoodClicked, onSpeechChange]);

  // ⭐ אנימציית שליחת ההודעות בזו אחר זו, אחרי הודעת הפתיחה
  useEffect(() => {
    if (step !== 1) return undefined;
    if (sentCount >= SEQUENTIAL_MESSAGES.length) return undefined;

    setIsSending(true);
    const timeout = setTimeout(() => {
      setIsSending(false);
      setSentCount((prev) => prev + 1);
    }, SEND_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [step, sentCount]);

  function handleOpenChat() {
    setStep(1);
    setSentCount(0);
    setIsSending(false);
    setUnderstoodClicked(false);
  }

  function handleUnderstood() {
    setUnderstoodClicked(true);
  }

  function handleGoToHolidayTable() {
    if (typeof onJumpToApp === "function") {
      onJumpToApp("excel", HOLIDAY_READINESS_PAGE);
      return;
    }
    // גיבוי אם משום מה onJumpToApp לא הועבר
    if (typeof onNext === "function") onNext();
    else if (typeof onComplete === "function") onComplete();
  }

  const allSent = sentCount >= SEQUENTIAL_MESSAGES.length;

  return (
    <div className="smsgal-root" dir="rtl">
      {step === 0 && (
        <button
          type="button"
          className="smsgal-notification"
          onClick={handleOpenChat}
        >
          <div className="smsgal-notification__text">
            <p className="smsgal-notification__title">
              הודעה נכנסת מאת מר"ג
              <br />
              בביצוע מערכת "גל"
            </p>
            <p className="smsgal-notification__subtitle">-לחצו להשיבה-</p>
          </div>
          <div className="smsgal-notification__icon">
            <img src={smsBubbleIcon} alt="" />
          </div>
        </button>
      )}

      {step === 1 && (
        <div className="smsgal-chat-window">
          <div className="smsgal-chat-header">
            <div className="smsgal-chat-header__meta">
              <p className="smsgal-chat-header__name">{SENDER_NAME}</p>
              <p className="smsgal-chat-header__time">היום {getTimestamp()}</p>
            </div>
            <img className="smsgal-chat-header__avatar" src={profilImg} alt="" />
          </div>

          <div className="smsgal-chat-body">
            {wasDeclined && (
              <div className="smsgal-bubble smsgal-bubble--wide">
                <p>{DECLINE_FOLLOWUP_MESSAGE}</p>
              </div>
            )}

            <div className="smsgal-bubble smsgal-bubble--wide">
              <p>{INTRO_MESSAGE}</p>
            </div>

            {SEQUENTIAL_MESSAGES.slice(0, sentCount).map((text, index) => (
              <div className="smsgal-bubble smsgal-bubble--pill" key={index}>
                <p>{text}</p>
              </div>
            ))}

            {isSending && (
              <div className="smsgal-bubble smsgal-bubble--sending">
                <span className="smsgal-dot" />
                <span className="smsgal-dot" />
                <span className="smsgal-dot" />
              </div>
            )}

            {allSent && !understoodClicked && (
              <button
                type="button"
                className="smsgal-understood-btn"
                onClick={handleUnderstood}
              >
                הבנתי
              </button>
            )}

            {understoodClicked && (
              <div className="smsgal-bubble smsgal-bubble--final">
                <p>
                  לצפייה בפרטים המלאים, היכנסו ל
                  <button
                    type="button"
                    className="smsgal-link"
                    onClick={handleGoToHolidayTable}
                  >
                    טבלת כוננות לחג
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="smsgal-chat-footer">
            <button type="button" className="smsgal-chat-footer__plus" aria-label="הוסף">
              +
            </button>
            <div className="smsgal-chat-footer__pill">
              <span className="smsgal-chat-footer__mic" aria-hidden="true">
                🎙
              </span>
              <span className="smsgal-chat-footer__placeholder">
                הודעות טקסט sms
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsGal;