import { useState, useEffect } from "react";
import BGPadlet from "../../../assets/images/BGPadlet.png";
import OutlookLogo from "../../../assets/images/apps/outlook.png";
import "./Outlook.css";
import BackButton from "../../elements/backButton/BackButton";

// ---------------------------------------------------------------------------
// Placeholder inbox rows. The first one is the unread message that opens the
// email view. Replace `subject` / `preview` with your real content.
// ---------------------------------------------------------------------------
const INBOX_ITEMS = [
  {
    id: "msg-1",
    subject: "עותק דוחות יומיים מרג",
    preview: "עדכון לגבי דוחות ימי המילואים השבועיים ",
    unread: true,
  },
  { id: "msg-2", subject: 'דו"ח ימים - מטה', preview: "דוח יומיים אתמול ישן", unread: false },
  { id: "msg-3", subject: 'דו"ח ימים - מטה', preview: "עוקב לרשימות / עדיין היום", unread: false },
  { id: "msg-4", subject: 'דו"ח ימים - מטה', preview: "עוקב לרשימות / עדיין היום", unread: false },
  { id: "msg-5", subject: 'דו"ח ימים - מטה', preview: "עוקב לרשימות / עדיין היום", unread: false },
];

// Placeholder body paragraphs for the opened email. Replace with real copy.
const EMAIL_BODY_LINES = [
  'שלום לכולם,',
  'מצ"ב דו"חות יומיים נכון לתאריך 14/04/2024.',
  'מבקש לקבל התייחסויות על הדוחות עד השעה 20:00 על גבי הדוחות.',
  'להלן פירוט הדו"חות והנחיות לטיפול, לפי הוראות החיל:',
  '1. דו"ח פניות מושל"ם הכי מעודכן- להציג את אופן הטיפול בפנייה ואת הסטטוס שלה.',
  '2. דו"ח פוטנציאל בג"ל- מציג לכם את כלל החיילים שאתם צריכים לשחרר ולשבץ בבג"ל/לסמל בהזנת ההשחרה שלהם. מתייחס לזה כמו בג"ל בשפ"פ.',
  '3. בלתי נקראים בשפ"פ- אסור שיהיו כאלו! יש לשחרר משמ"פ/לפעול להסדרת מבר"ל.',
  '4. קלוט ולא מוצב/מוצב ולא קלוט- חיילים אשר נדרשים בקליטה/הצבה בהתאם או הסדרת מצבם. מי שלא נקלט אבקש התייחסות בהתאם.',
  '5. פערי חשבון בנק - נדרש להזין לכולם מספר חשבון בנק ותקן, ולוודא כי סעיף הכלל חייל בקצה על מנת להביא לידיעתו כי חשבון בנק הגבוזת אינו תקין.',
  '6. חסר טלפון או חסר טלפון למקרה אסון עיקרי בשפ"פ- יש לעדכן בדחיפות את הפרטים האישיים של החיילים.',
  'מזכיר שמי שמעביר התייחסות = טופל.',
  'שבוע טוב ושקט לכולם,',
];


const ExcelIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <rect x="1" y="1" width="22" height="22" rx="3" fill="#1D6F42" />
    <text
      x="12"
      y="16.5"
      textAnchor="middle"
      fontSize="12"
      fontWeight="700"
      fill="#ffffff"
      fontFamily="Arial, sans-serif"
    >
      X
    </text>
  </svg>
);

const Outlook = ({
  page = 0,
  onPageChange,
//   onBack,
//   onHome,
  onComplete,
  onNext,
}) => {
  const [mounted, setMounted] = useState(false);
  const isOpened = page >= 1;

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const openFirstMessage = (item) => {
    if (!item.unread) return; // only the flagged message opens the email view
    if (typeof onPageChange === "function") onPageChange(1);
  };
const goBackToInbox = () => {
  if (typeof onPageChange === "function") {
    onPageChange(0);
  }
};
  const goToExcel = () => {
    if (typeof onNext === "function") onNext();
    else if (typeof onComplete === "function") onComplete();
  };

return (
  <section className="outlook-page" dir="rtl">
    <div className={`outlook-window ${mounted ? "outlook-window--in" : ""}`}>
      <div className="outlook-titlebar">
        <img src={OutlookLogo} alt="Outlook" className="outlook-titlebar__logo" />
        <span className="outlook-titlebar__label">OUTLOOK</span>
      </div>

      <div className="outlook-body">
        {!isOpened ? (
          <ul className="outlook-inbox">
            {INBOX_ITEMS.map((item) => (
              <li
                key={item.id}
                className={["outlook-inbox__row", item.unread ? "outlook-inbox__row--unread" : ""].join(" ").trim()}
                onClick={() => openFirstMessage(item)}
                role={item.unread ? "button" : undefined}
                tabIndex={item.unread ? 0 : undefined}
                onKeyDown={(e) => {
                  if (item.unread && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    openFirstMessage(item);
                  }
                }}
              >
                {item.unread && <span className="outlook-inbox__dot" aria-hidden="true" />}
                <div className="outlook-inbox__text">
                  <span className="outlook-inbox__subject">{item.subject}</span>
                  <span className="outlook-inbox__preview">{item.preview}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="outlook-email">
            <div className="outlook-email__meta">
  <button
    type="button"
    className="outlook-email__back"
    onClick={goBackToInbox}
    aria-label="חזרה לתיבת המיילים"
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="outlook-email__back-icon"
    >
      <path
        d="M9 5L16 12L9 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    <span>חזרה לתיבת הדואר</span>
  </button>

  <span className="outlook-email__subject">
    {INBOX_ITEMS[0].subject}
  </span>
</div>
            <div className="outlook-email__content">
              {EMAIL_BODY_LINES.map((line, i) => {
                const isNumberedSection = /^\d+\./.test(line) && line.includes("-");
                return (
                  <p key={i} className="outlook-email__line">
                    {isNumberedSection ? (
                      <>
                        <strong>{line.substring(0, line.indexOf("-"))}</strong>
                        {line.substring(line.indexOf("-"))}
                      </>
                    ) : (
                      line
                    )}
                  </p>
                );
              })}
            </div>

            <button type="button" className="outlook-email__btn" onClick={goToExcel}>
              <ExcelIcon />
              <span>עותק דוחות מרג- היום</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </section>
);
};

export default Outlook;