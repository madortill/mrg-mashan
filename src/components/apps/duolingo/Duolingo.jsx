// duolingo.jsx
import { useState, useEffect, useCallback } from "react";
import duolingoIcon from "../../../assets/images/apps/duolingoIcon.svg";
import { questions } from "./duolingoData";
import "./Duolingo.css";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = questions.length;
const STORAGE_KEY = "duolingo-progress";

const ANSWER_PLACEHOLDER = "כתבו כאן את תשובתכם...";

// ---------------------------------------------------------------------------
// מצב ברירת מחדל: מערך באורך מספר השאלות, כל איבר = { text, checked }
// ---------------------------------------------------------------------------
function createDefaultAnswers() {
  return questions.map(() => ({ text: "", checked: false }));
}

// טעינת מצב שמור מ-sessionStorage (אם המשתמש כבר ענה על חלק מהשאלות)
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

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const completedCount = answers.filter((a) => a.checked).length;
  const progressPercent = (completedCount / TOTAL_QUESTIONS) * 100;

  // שמירה אוטומטית בכל שינוי תשובות, כדי שחזרה אחורה / כניסה מחדש תשמור מצב
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* מתעלמים משגיאת אחסון */
    }
  }, [answers]);

  // טקסט בועה מנחה, לפי מצב השאלה הנוכחית
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
    if (currentAnswer.checked) return; // נעול - אי אפשר לשנות אחרי בדיקה

    const value = event.target.value;
    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = { ...next[currentIndex], text: value };
      return next;
    });
  }

  function handleCheck() {
    if (currentAnswer.checked) return;

    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = { ...next[currentIndex], checked: true };
      return next;
    });
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }

  function handleNext() {
    if (!currentAnswer.checked) return; // לא ניתן להתקדם בלי לבדוק

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
        <img
          className="duolingo-header__avatar"
          src={duolingoIcon}
          alt=""
        />
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
          onClick={handleCheck}
          disabled={currentAnswer.checked}
        >
          לבדיקה
        </button>

        {currentAnswer.checked && (
          <div className="duolingo-correct-answer">
            <p className="duolingo-correct-answer__title">התשובה הנכונה</p>
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