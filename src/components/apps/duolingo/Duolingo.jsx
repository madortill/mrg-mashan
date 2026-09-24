// duolingo.jsx
import { useState, useEffect, useCallback } from "react";
import duolingoIcon from "../../../assets/images/apps/duolingoIcon.svg";
import { questions } from "./duolingoData";
import "./Duolingo.css";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = questions.length;
const STORAGE_KEY = "duolingo-progress";
const POPUP_SEEN_KEY = "duolingo-popup-seen"; // מפתח חדש לשמירת מצב הפופ-אפ

const ANSWER_PLACEHOLDER = "כתבו כאן את תשובתכם...";

function createDefaultAnswers() {
  return questions.map(() => ({ text: "", checked: false }));
}

function loadSavedAnswers() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultAnswers();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== TOTAL_QUESTIONS) {
      return createDefaultAnswers();
    }

    return parsed.map((item) => ({
      text: typeof item?.text === "string" ? item.text : "",
      checked: Boolean(item?.checked),
    }));
  } catch {
    return createDefaultAnswers();
  }
}

const duolingo = ({ page, onPageChange, onComplete, onSpeechChange }) => {
  const navigate = useNavigate();

  const currentIndex = typeof page === "number" ? page : 0;
  const setCurrentIndex = useCallback(
    (next) => {
      if (typeof onPageChange === "function") onPageChange(next);
    },
    [onPageChange]
  );

  const [answers, setAnswers] = useState(loadSavedAnswers);
  const [showFinishPopup, setShowFinishPopup] = useState(false);
  const [showLockPopup, setShowLockPopup] = useState(false);
  
  // סטייט חדש: בודק האם המשתמש כבר נחשף לפופ-אפ האזהרה בעבר
  const [hasSeenLockPopup, setHasSeenLockPopup] = useState(() => {
    return sessionStorage.getItem(POPUP_SEEN_KEY) === "true";
  });

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const completedCount = answers.filter((a) => a.checked).length;
  const progressPercent = (completedCount / TOTAL_QUESTIONS) * 100;

  const isAnswerEmpty = !currentAnswer.text.trim();

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* מתעלמים משגיאת אחסון */
    }
  }, [answers]);

  useEffect(() => {
    if (typeof onSpeechChange !== "function") return;

    if (!currentAnswer.checked) {
      onSpeechChange('ענו על השאלה ולחצו על "לבדיקה" כדי לראות את התשובה הנכונה.');
    } else if (isLastQuestion) {
      onSpeechChange('בדקתם את כל השאלות - לחצו "סיום" כדי לסיים את התרגול.');
    } else {
      onSpeechChange('אפשר לעבור לשאלה הבאה, או לחזור אחורה ולעיין בתשובות קודמות.');
    }
  }, [currentAnswer.checked, isLastQuestion, onSpeechChange]);

  useEffect(() => {
    return () => onSpeechChange?.("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswerChange(event) {
    if (currentAnswer.checked) return;

    const value = event.target.value;
    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = { ...next[currentIndex], text: value };
      return next;
    });
  }

  // פונקציית הבדיקה המעודכנת
  function handleCheckClick() {
    if (currentAnswer.checked || isAnswerEmpty) return;

    if (hasSeenLockPopup) {
      // אם הוא כבר ראה את הפופ-אפ בעבר, נועלים מיד ללא אזהרה נוספת
      lockCurrentAnswer();
    } else {
      // אם זו הפעם הראשונה, מציגים את הפופ-אפ
      setShowLockPopup(true);
    }
  }

  // לוגיקת נעילת התשובה שפוצלה לפונקציה נפרדת כדי למנוע כפל קוד
  function lockCurrentAnswer() {
    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = { ...next[currentIndex], checked: true };
      return next;
    });
  }

  // אישור סופי בפופ-אפ - מופעל רק בפעם הראשונה
  function handleConfirmLock() {
    setShowLockPopup(false);
    setHasSeenLockPopup(true);
    try {
      sessionStorage.setItem(POPUP_SEEN_KEY, "true");
    } catch {
      /* מתעלמים משגיאת אחסון */
    }
    lockCurrentAnswer();
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }

  function handleNext() {
    if (!currentAnswer.checked) return;

    if (isLastQuestion) {
      setShowFinishPopup(true);
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  function handleFinishConfirm() {
    setShowFinishPopup(false);
    onComplete?.();
    navigate("/end");
  }

  return (
    <div className="duolingo-app" dir="rtl">
      <div className="duolingo-header">
        <span className="duolingo-header__title">duolingo</span>
        <img className="duolingo-header__avatar" src={duolingoIcon} alt="" />
      </div>

      <div className="duolingo-progress-row">
        <span className="duolingo-progress-row__label">
          {currentIndex + 1}/{TOTAL_QUESTIONS}
        </span>
        <div className="duolingo-progress-bar">
          <div
            className="duolingo-progress-bar__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="duolingo-body">
        <p className="duolingo-question">{currentQuestion.question}</p>

        <textarea
          className="duolingo-answer-box"
          value={currentAnswer.text}
          onChange={handleAnswerChange}
          placeholder={ANSWER_PLACEHOLDER}
          readOnly={currentAnswer.checked}
          disabled={currentAnswer.checked}
        />

        <button
          type="button"
          className="duolingo-check-btn"
          onClick={handleCheckClick}
          disabled={currentAnswer.checked || isAnswerEmpty}
        >
          הגש
        </button>

        {currentAnswer.checked && (
          <div className="duolingo-correct-answer">
            <p className="duolingo-correct-answer__title"> התשובה הנכונה</p>
            <div className="duolingo-correct-answer__box">
              <p>{currentQuestion.correctAnswer}</p>
            </div>
          </div>
        )}
      </div>

      <div className="duolingo-footer">
        <button
          type="button"
          className="duolingo-nav-btn duolingo-nav-btn--next"
          onClick={handleNext}
          disabled={!currentAnswer.checked}
        >
          {isLastQuestion ? "סיום" : "הבא >"}
        </button>

        <button
          type="button"
          className="duolingo-nav-btn duolingo-nav-btn--prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          {"< קודם"}
        </button>
      </div>

      {showLockPopup && (
        <div className="duolingo-popup-layer">
          <div className="duolingo-popup-backdrop" onClick={() => setShowLockPopup(false)} />
          <div className="duolingo-popup">
            <p className="duolingo-popup__title">שימו לב!</p>
            <p className="duolingo-popup__text">לאחר ההגשה לא ניתן יהיה לערוך או לשנות את התשובה. האם להמשיך?</p>
            <div className="duolingo-popup__actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
              <button
                type="button"
                className="duolingo-popup__btn"
                onClick={handleConfirmLock}
              >
                כן, להגיש
              </button>
              <button
                type="button"
                className="duolingo-popup__btn duolingo-popup__btn--cancel"
                onClick={() => setShowLockPopup(false)}
                style={{ backgroundColor: '#ccc', color: '#333' }}
              >
                חזרה לעריכה
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishPopup && (
        <div className="duolingo-popup-layer">
          <div className="duolingo-popup-backdrop" />
          <div className="duolingo-popup">
            <p className="duolingo-popup__title">כל הכבוד!</p>
            <p className="duolingo-popup__text">סיימת את התרגול בהצלחה</p>
            <button
              type="button"
              className="duolingo-popup__btn"
              onClick={handleFinishConfirm}
            >
              סיום
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default duolingo;
