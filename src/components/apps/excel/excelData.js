// ============================================================
// כל הטקסטים והערכים של זרימת האקסל נמצאים כאן.
// להוספת טבלה חדשה לרצף הרגיל: מוסיפים בסוף מערך screens אובייקט
// popup (אופציונלי) + table. הסדר במערך = סדר ההופעה בפועל בלחיצות "הבא".
// ============================================================

export const screens = [
  // מסך 0 — פופאפ פתיחה, מוצג לפני שרואים טבלה בכלל
  {
    type: "popup",
    title: null,
    text: "דוח זה מציג את הפערים בזמן מענה לפניות של חיילים אשר פנו למוקד המילואים. לאחר שחיילי המילואים פונים למוקד עוברת הפנייה לטיפול קצין מטה המילואים, במידה והקצין לא מחזיר תשובה תוך חמישה ימים, הדבר נחשב לחריגות.",
    highlightText: "על מנת לסגור חריגות אלו, יש לטפל בפניית החייל באפליקציית הקודקוד.",
    buttonType: "check",
  },

  // מסך 1 — הטבלה הראשונה
  {
    type: "table",
    tableName: "פניות קודקוד",
    columns: [
      { key: "unit", label: "אגודה" },
      { key: "team", label: "חטיבה \\ יח'" },
      { key: "division", label: "יחידה" },
      { key: "openDate", label: "תאריך פתיחת פנייה" },
      { key: "personalId", label: "מ.א" },
      { key: "soldierName", label: "שם חייל" },
      { key: "sla", label: "סטטוס SLA" },
      { key: "topic", label: "נושא פנייה" },
      { key: "time", label: "זמן" },
    ],
    rows: [
      { unit: "איוש", team: "9341", division: "6430", openDate: "23/08/26", personalId: "1234567", soldierName: "ישראל", sla: "חוגר", topic: "החזר הוצאות נסיעה", time: "עד חודש" },
      { unit: "אויט", team: "9341", division: "6430", openDate: "23/08/26", personalId: "1234567", soldierName: "ישראל", sla: "חוגר", topic: "החזר הוצאות נסיעה", time: "עד חודש" },
    ],
    confirmLabel: "הבנתי",
    bubbleText: "עדיין ניתן לעבור על הנתונים בתוך חמישה ימים, אחרת הדבר כרוך בקנס",
  },

  // מסך 2 — נפתח בלחיצה על "הבנתי" בטבלה. אייקון: חץ (next)
  {
    type: "popup",
    title: "פוטנציאל בנ”ל ",
    text: "דוח זה מפרט על החיילים שעתידים להיות מוקפאים משירות מילואים מסיבות שונות. חיילים אלו לא נמצאים בשמפ ולכן אין לזמן אותם.",
    highlightText: "יש לשבץ את החיילים במסגרת ממתינים תחת אישור בלתי נקראים על מנת להוריד את החריגות .",
    buttonType: "arrow",
  },

  // מסך 3 — אותו פופאפ בדיוק, רק הטקסט והאייקון מתחלפים ל-check (לא נסגר!)
  {
    type: "popup",
    title: "דוח בנ\"ל בשמ\"פ",
    text:  "ש לשחרר מידית את החיילים מהיחידה לאחר זיכוי ציוד, לתת ימי התארגנות ולסגור את השמפ!במידה ומדובר בהקפאה, יש לשבץ חיילים אלו במסגרת ממתינים תחת אישור בלתי נקראים על מנת להוריד את החריגות.במידה ומדובר בחריג ייעוד והחייל מעוניין להישאר ביחידה, לאחר שחרור החייל וסגירת השמפ - יש להחתים את החייל על מסמכי השארה ליחידה. לאחר הזנתם במערכת, נוכל לזמנו למילואים.",
    highlightText: "דוח זה מפרט על החיילים שהופעלה עליהם הקפאה למרות שנמצאים בשמ\"פ",
    buttonType: "check",
  },

  // מסך 4 — הטבלה השנייה
  {
    type: "table",
    tableName: 'דוחות בנ"ל (פוטניציאל + בשמ"פ)',

    columns: [
      { key: "unit", label: "מספר אישי" },
      { key: "team", label: "שם פרטי ומשפחה" },
      { key: "division", label: "יחידה" },
      { key: "openDate", label: "תאריך פתיחת פנייה" },
      { key: "personalId", label: "מסגרת" },
      { key: "soldierName", label: "תאריך תתש מילואים" },
      { key: "reason", label: "אינדיקטור שמפ מילאוים" },
    ],
    rows: [
      { unit: "1234567", team: "9341", division: "6430", openDate: "23/08/26", personalId: "1234567", soldierName: "ישראל", sla: "חוגר", topic: "החזר הוצאות נסיעה", time: "עד חודש" },
   
  
    ],
    confirmLabel: "לדוח נוסף",
    bubbleText: "דוגמא לאיך נראים שתי הדוחות האלו ",
  },
  //מוצב ולא קלוט
  {
    type: "table",
    tableName: "מוצב ולא קלוט",
    columns: [
      { key: "unit", label: "אגודה" },
      { key: "team", label: "חטיבה \\ יח'" },
      { key: "division", label: "יחידת הצבה" },
      { key: "row4", label: "פיקוד + אוגדה " },
      { key: "openDate", label: "הצבה " },
      { key: "personalId", label: "תאריך קליטה" },
      { key: "soldierName", label: "יחידה קודמת" },
      { key: "reason", label: "יחידת קליטה " },
    ],
    rows: [
      { unit: "שם ומ.א", team: "9341", division: "6430", openDate: "X", personalId: "0", soldierName: "מאגר 344", reason: "חטמר אפרים", topic: "החזר הוצאות נסיעה", time: "עד חודש" },
    ],
    confirmLabel: "הבנתי",
    bubbleText: "הטיפול שלי בדו”ח הזה הוא קליטת החיילים, וכתיבת מכתב הסבר על אי קליטת החייל בזמן ",
  },

  // -- להוסיף עוד טבלאות לרצף הרגיל: להעתיק את התבנית של מסך 2+3+4 ולהדביק כאן --
];

// ============================================================
// טבלת "כוננות לחג" — במכוון לא חלק ממערך screens למעלה.
// היא לא נגישה עreasonהבא"/"הבנתי" בתוך האקסל בזרימה הרגילה,
// אלא רק בקפיצה ישירה (למשל מהקישור בהודעת ה-SMS של SmsGal),
// ע"י שימוש בקבוע העמוד הייעודי HOLIDAY_READINESS_PAGE.
// ============================================================
//כוננות חגים
export const HOLIDAY_READINESS_PAGE = "holidayReadiness";

export const holidayReadinessScreen = {
  type: "table",
      tableName:  "כוננות חגים-התקשרויות לרשת הרקמה",

  columns: [
    { key: "team", label: "חטיבה \\ יח'" },
    { key: "personalId", label: "מ.א" },
    { key: "unit", label: "תפקיד בעץ מבנה" },
    { key: "division", label: "שם ק מילואים" },
    { key: "openDate", label: "טלפון עיקרי" },
    { key: "soldierName", label: "פסח" },
    { key: "status", label: "תאריך ביצוע השיחה" },
  ],
  rows: [
      {
      id: "1",
      team: "חטמ\"ר עציון 8015 / גדוד 21",
      personalId: "XXXXXXX",
      unit: "אלפסי",
      division: "אסרף",
      openDate: "052-XXXXXXX",
      soldierName: "V", // מסומן כ-V בעמודות התאריכים
      status: "23.3.23"
    },
    {
      id: "2",
      team: "חטמ\"ר עציון 8015 / גדוד 21",
      personalId: "XXXXXXX",
      unit: "תמיר",
      division: "אליהו",
      openDate: "052-XXXXXXX",
      soldierName: "V",
      status: "23.3.23"
    },
    {
      id: "3",
      team: "חטמ\"ר עציון 8015 / גדוד 21",
      personalId: "XXXXXXX",
      unit: "רפאל",
      division: "אוזן",
      openDate: "050-XXXXXXX",
      soldierName: "V",
      status: "23.3.23"
    },
    {
      id: "4",
      team: "חטמ\"ר עציון 8015 / גדוד 21",
      personalId: "XXXXXXX",
      unit: "קליג",
      division: "אלחזוב",
      openDate: "050-XXXXXXX",
      soldierName: "V",
      status: "23.3.23"
    },
    {
      id: "5",
      team: "חטמ\"ר עציון 8015 / גדוד 21",
      personalId: "XXXXXXX",
      unit: "נויה",
      division: "מרדכי",
      openDate: "054-XXXXXXX",
      soldierName: "V",
      status: "23.3.23"
    }
  ],
  confirmLabel: "סיום",
  bubbleText: 'זוההי טבלת כוננות לחגים. מציגה את ההתקשרויות לרשת הרקמה',
};