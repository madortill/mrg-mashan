import { useState, useEffect, useCallback } from "react";

import "./NewsToday.css"
import HayomIcon from "../../../assets/images/apps/todayLogo.png";
import IsraelHayomLogo from "../../../assets/images/apps/Israel_Hayom.svg";
import guidingImg from "../../../assets/images/guidingImg.png";
import guidingImgLeft from "../../../assets/images/leftNews.png" ;


// ---------------------------------------------------------------------------
// Article copy — exactly as provided.
// ---------------------------------------------------------------------------
const Alltext = [
  'במרכז גיוס מתבצעות מידי יום תורנויות המהוות עתודה למצב חירום, זאת כחלק מההוראה המבצעית למוכנות וכוננות מערך הגיוס בהתאמה למצבי הכוננות בצה”ל',
  `מדי יום, יישארו במרכז הגיוס מפקד תורן (קצין או נגד) ומש"ק תורן מקריית משא"ן המילואים. תורנות זו תבוצע אך ורק על ידי בעלי תפקידים אשר עברו הליך חפיפה מקצועית וחניכה ואושרו לביצוע התורנות ע"י מפקד מרכז הגיוס/סגנו.

תפקידם לבצע את הפעולות הנדרשות ולקדם מוכנות מרכז הגיוס למעבר משגרה לחירום, עד להגעת הממ"ג או בעל תפקיד אחר, אשר מוסמך להפעיל את הגיוס.`,
];

const HIGHLIGHT_PHRASE =
  'בעלי תפקידים אשר עברו הליך חפיפה מקצועית וחניכה ואושרו לביצוע התורנות ע"י מפקד מרכז הגיוס/סגנו.';

const renderWithHighlight = (text, phrase) => {
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="nt-highlight">{phrase}</mark>
      {text.slice(idx + phrase.length)}
    </>
  );
};

// ---------------------------------------------------------------------------
// DailyNEWS reveal cards — replace title/description/schedule with real copy.
// ---------------------------------------------------------------------------
const DAILY_CARDS = [
  {
    id: "card-1",
    title: "תדרוך מפקדתו",
    description:
      "עם תחילת ההיערכות, יוצא המפקד לתדרוך צוותי הגיוס בדרג ראשון (מטה), ומעביר לבעלי התפקידים את דרכי התפקוד הנדרשים לשעת חירום.",
    schedule: "כל יום | 08:00",
  },
  {
    id: "card-2",
    title: "תדרוך",
    description:
      "מדי יום, מתקיים תדרוך קצר של מפקד מרכז הגיוס עם צוותי המשמרת, בו מועברים העדכונים הנדרשים לשמירה על תפקוד תקין של המרכז.",
    schedule: "כל יום | 08:00",
  },
];

const STORAGE_KEY = "newsToday.dailyCardsRevealed";

const loadRevealedState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRevealedState = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
};

const EyeSlashIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
    <path
      d="M2 12s3.5-6 10-6c2 0 3.7.5 5.1 1.3M22 12s-3.5 6-10 6c-2 0-3.7-.5-5.1-1.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PlaceholderPhoto = () => (
  <svg viewBox="0 0 120 80" width="100%" height="100%" aria-hidden="true">
    <rect width="120" height="80" fill="#dfe3e8" />
    <circle cx="30" cy="30" r="10" fill="#b9c0c9" />
    <circle cx="50" cy="34" r="10" fill="#b9c0c9" />
    <circle cx="70" cy="30" r="10" fill="#b9c0c9" />
    <rect x="14" y="46" width="92" height="24" rx="3" fill="#c7ccd3" />
  </svg>
);

const RevealCard = ({ card, revealed, onReveal }) => (
  <div className="nt-card">
    <h3 className="nt-card__title">{card.title}</h3>

    <button
      type="button"
      className={`nt-card__media ${revealed ? "" : "nt-card__media--blurred"}`}
      onClick={() => !revealed && onReveal(card.id)}
      aria-pressed={revealed}
      aria-label={revealed ? card.title : `הצג את ${card.title}`}
    >
      <PlaceholderPhoto />
    </button>

    <p className={`nt-card__desc ${revealed ? "" : "nt-card__desc--blurred"}`}>
      {card.description}
    </p>

    {!revealed && (
      <div className="nt-card__lock-overlay" aria-hidden="true">
        <EyeSlashIcon />
        <span className="nt-card__lock-label">לחצו לצפייה</span>
      </div>
    )}

    <span className="nt-card__schedule">{card.schedule}</span>
  </div>
);

const NewsToday = ({
  onComplete,
  onNext,
  onBack,
  onHome,
  page,
  onPageChange,
  onSpeechChange,
}) => {
  // 0 = popup, 1 = article, 2 = DailyNEWS reveal cards
  const [internalStep, setInternalStep] = useState(0);
  const step = typeof page === "number" ? page : internalStep;
  const setStep = (next) => {
    if (typeof onPageChange === "function") onPageChange(next);
    else setInternalStep(next);
  };

  const [mounted, setMounted] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [revealed, setRevealed] = useState(() => loadRevealedState());

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (typeof onSpeechChange !== "function") return;
    if (step === 2) {
      onSpeechChange("לחצו על שני התדרוכים כדי לחשוף אותם, ואז תוכלו להמשיך.");
    } else if (step === 1) {
      onSpeechChange('קראו את הכתבה ולחצו על "להמשך קריאה" כדי להתקדם.');
    } else {
      onSpeechChange("הופיע חלון חדש - בחרו אחת מהאפשרויות כדי להמשיך.");
    }
  }, [step, onSpeechChange]);

  const revealCard = useCallback((id) => {
    setRevealed((prev) => {
      const next = { ...prev, [id]: true };
      saveRevealedState(next);
      return next;
    });
  }, []);

  const allRevealed = DAILY_CARDS.every((c) => revealed[c.id]);

  const openArticle = () => setStep(1);
  const openDailyCards = () => setStep(2);
  const backToArticle = () => setStep(1);

  const finishApp = () => {
    if (typeof onComplete === "function") onComplete();
    else if (typeof onNext === "function") onNext();
  };

  return (
    <div className={`nt-root ${mounted ? "nt-root--in" : ""}`} dir="rtl">
      {step === 0 && (
        // -------------------- Popup step --------------------
        <div className="nt-popup-layer">
          <div className="nt-popup-backdrop" />
          <div className="nt-modal">
            <div className="nt-modal__logo">
              <img src={HayomIcon} alt="ישראל היום" className="nt-modal__logo-img" />
            </div>
            <div className="nt-modal__body">
              <p className="nt-modal__text">
                רוצים לדעת אילו תורנויות מר"ג מתבצעות מידי יום?
              </p>
              <div className="nt-modal__actions">
                <button type="button" className="nt-modal__link" onClick={openArticle}>
                  חייב לדעת
                </button>
                <button type="button" className="nt-modal__btn" onClick={openArticle}>
                  כן רוצה
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        // -------------------- Article step --------------------
        <div className="nt-article">
          <div className="nt-article__nav">
            <div className="nt-article__logo">
              <img src={IsraelHayomLogo} alt="ישראל היום" className="nt-article__logo-img" />
            </div>
            <nav className="nt-article__menu" aria-hidden="true">
              <span>ראשי</span>
              <span>חדשות</span>
              <span>דעות+</span>
              <span>פודקאסטים</span>
              <span>תרבות</span>
              <span>בריאות</span>
              <span>רכב</span>
              <span>דיגיטל</span>
              <span>אוכל</span>
            </nav>
          </div>

          <div className="nt-article__body">
            {!adDismissed && (
              <aside className="nt-ad-card">
                <button
                  type="button"
                  className="nt-ad-card__close"
                  onClick={() => setAdDismissed(true)}
                  aria-label="סגור פרסומת"
                >
                  ✕
                </button>
                <p className="nt-ad-card__text">היה מוכן! תרגול מוביל לשלמות</p>
              </aside>
            )}

            <h1 className="nt-article__title">{Alltext[0]}</h1>

            {Alltext[1].split("\n\n").map((para, i) => (
              <p key={i} className="nt-article__paragraph">
                {renderWithHighlight(para, HIGHLIGHT_PHRASE)}
              </p>
            ))}

            <button type="button" className="nt-article__continue" onClick={openDailyCards}>
              <span>להמשך קריאה</span>
              <span className="nt-article__chevron" aria-hidden="true">⌄</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        // -------------------- DailyNEWS reveal-cards step --------------------
        <div className="nt-daily">
          <div className="nt-daily__header">
            <img src={IsraelHayomLogo} alt="ישראל היום" className="nt-daily__logo" />
            <span className="nt-daily__title">DailyNEWS</span>
            <img src={HayomIcon} alt="" className="nt-daily__icon" />
          </div>

          <div className="nt-daily__cards">
            {DAILY_CARDS.map((card) => (
              <RevealCard
                key={card.id}
                card={card}
                revealed={!!revealed[card.id]}
                onReveal={revealCard}
              />
            ))}
          </div>

          <div className="nt-daily__actions">
            <button type="button" className="nt-daily__back" onClick={backToArticle}>
              <span aria-hidden="true">→</span>
              <span>חזור לכתבה</span>
            </button>
            <button
              type="button"
              className="nt-daily__next"
              disabled={!allRevealed}
              onClick={finishApp}
            >
              לעמוד הבא
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsToday;