// Calling.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import answerIcon from "../../../assets/images/answer.svg";
import declineIcon from "../../../assets/images/decline.svg";
import soundOffIcon from "../../../assets/images/sound-off.svg";
import soundOnIcon from "../../../assets/images/sound-on.svg";
import callAudio from "../../../assets/audio/callAudio.mp3";
import "./Calling.css";

// ---------------------------------------------------------------------------
// טקסט הגוף שמוצג בזמן השיחה הפעילה
// ---------------------------------------------------------------------------
const CALL_BODY_TEXT =
  'מרכז גיוס אחראי על חיוג בחירום בהתאם לפקודת אמ"ץ ולשבצ"ק שלנו. באמצעות מערכת הקריאה, מרכז הגיוס מוציא חיוג לחיילי המילואים ע"פ הדרישה ומביא לקריאה של מקסימום חיילים במינימום זמן.';

const WAIT_ON_DESKTOP_MS = 2200; // "כמה שניות" במסך הבית לפני מעבר הלאה
const DECLINE_MESSAGE_MS = 2200; // כמה זמן מוצגת הודעת "השארתם הודעה"

export const CALL_ANSWERED_KEY = "callAnsweredByUser";

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const Calling = ({ page, onPageChange, onNext, onComplete, onSpeechChange }) => {
  const step = typeof page === "number" ? page : 0;
  const setStep = useCallback(
    (next) => {
      if (typeof onPageChange === "function") onPageChange(next);
    },
    [onPageChange]
  );

  const [mounted, setMounted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const tickRef = useRef(null);
  const advanceTimeoutRef = useRef(null);

  // אנימציית כניסה, באותה שיטה כמו ב-NewsToday
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // טקסט הבועה מעל הראש, לפי שלב
  useEffect(() => {
    if (typeof onSpeechChange !== "function") return;

    if (step === 1) {
      onSpeechChange('אתם בשיחה עם מר"ג. כשתסיימו, לחצו על כפתור הניתוק.');
    } else if (step === 2) {
      onSpeechChange("דחיתם את השיחה - נשארה הודעה למרכז הגיוס.");
    } else if (step === 3) {
      onSpeechChange("");
    } else {
      onSpeechChange('יש שיחה נכנסת ממרכז הגיוס - ענו או דחו כדי להמשיך.');
    }
  }, [step, onSpeechChange]);

  // ניקוי טיימרים/סאונד ביציאה מהקומפוננטה
  useEffect(() => {
    return () => {
      clearInterval(tickRef.current);
      clearTimeout(advanceTimeoutRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const goNext = useCallback(() => {
    if (typeof onNext === "function") onNext();
    else if (typeof onComplete === "function") onComplete();
  }, [onNext, onComplete]);

  function handleAnswer() {
    sessionStorage.setItem(CALL_ANSWERED_KEY, JSON.stringify(true));
    setElapsedSeconds(0);
    setStep(1);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }

    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }

  function handleDeclineBeforeAnswer() {
    sessionStorage.setItem(CALL_ANSWERED_KEY, JSON.stringify(false));
    setStep(2);

    advanceTimeoutRef.current = setTimeout(() => {
      setStep(3);
      advanceTimeoutRef.current = setTimeout(goNext, WAIT_ON_DESKTOP_MS);
    }, DECLINE_MESSAGE_MS);
  }

  function handleHangUp() {
    clearInterval(tickRef.current);
    audioRef.current?.pause();
    setStep(3);

    advanceTimeoutRef.current = setTimeout(goNext, WAIT_ON_DESKTOP_MS);
  }

  function toggleSound() {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  return (
    <div className={`calling-root ${mounted ? "calling-root--in" : ""}`} dir="rtl">
      <audio ref={audioRef} src={callAudio} loop />

      {(step === 0 || step === 1 || step === 2) && (
        <div className="calling-popup-layer">
          <div className="calling-popup-backdrop" />

          {step === 0 && (
            <div className="calling-modal calling-modal--small">
              <p className="calling-modal__title">
                שיחה נכנסת מאת מר"ג לענות?
              </p>
              <div className="calling-modal__actions calling-modal__actions--row">
                <button
                  type="button"
                  className="calling-modal__icon-btn calling-modal__icon-btn--decline"
                  onClick={handleDeclineBeforeAnswer}
                  aria-label="דחה שיחה"
                >
                  <img src={declineIcon} alt="" />
                </button>
                <button
                  type="button"
                  className="calling-modal__icon-btn calling-modal__icon-btn--answer"
                  onClick={handleAnswer}
                  aria-label="ענה לשיחה"
                >
                  <img src={answerIcon} alt="" />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="calling-modal calling-modal--expanded">
              <button
                type="button"
                className="calling-modal__sound-toggle"
                onClick={toggleSound}
                aria-label={isMuted ? "הפעל קול" : "השתק"}
              >
                <img src={isMuted ? soundOffIcon : soundOnIcon} alt="" />
              </button>

              <p className="calling-modal__timer">{formatTime(elapsedSeconds)}</p>
              <p className="calling-modal__body-text">{CALL_BODY_TEXT}</p>

              <div className="calling-modal__actions">
                <button
                  type="button"
                  className="calling-modal__icon-btn calling-modal__icon-btn--decline"
                  onClick={handleHangUp}
                  aria-label="נתק שיחה"
                >
                  <img src={declineIcon} alt="" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="calling-modal calling-modal--small">
              <p className="calling-modal__title">
                   מרכז הגיוס השאיר לכם הודעה
              </p>
            </div>
          )}
        </div>
      )}
      {/* step === 3: אין פופ-אפ, המחשב נשאר גלוי ברקע (showDesktopBehind) */}
    </div>
  );
};

export default Calling;