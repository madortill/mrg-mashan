import { useEffect } from "react";
import "./Excel.css";
import ExcelWindow from "./ExcelWindow";
import ExcelTable from "./ExcelTable";
import InfoPopup from "./InfoPopup";
import BackButton from "../../elements/backButton/BackButton";
import { screens, holidayReadinessScreen, HOLIDAY_READINESS_PAGE } from "./excelData";

const Excel = ({ page = 0, onPageChange, onBack, onHome, onComplete, onSpeechChange }) => {
  // ⭐ חדש - מסך "כוננות לחג" הוא לא חלק ממערך screens הרגיל.
  // מגיעים אליו רק בקפיצה ישירה (page === HOLIDAY_READINESS_PAGE), לרוב מ-SmsGal.
  const isHolidayScreen = page === HOLIDAY_READINESS_PAGE;

  const currentScreen = isHolidayScreen ? holidayReadinessScreen : screens[page];
  const isPopupActive = currentScreen.type === "popup";

  const lastTableScreen = isHolidayScreen
    ? holidayReadinessScreen
    : screens
        .slice(0, page + 1)
        .reverse()
        .find((s) => s.type === "table");

  // ⭐ בכל שינוי מסך, מעדכנים את הטקסט למעלה
  useEffect(() => {
    const text = !isPopupActive ? lastTableScreen?.bubbleText ?? "" : "";
    onSpeechChange?.(text);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // ⭐ כשעוזבים את הרכיב (unmount), מנקים כדי שהבועה לא תישאר תלויה
  useEffect(() => {
    return () => onSpeechChange?.("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = () => {
    // ⭐ מסך "כוננות לחג" הוא סוף עצמאי - לא ממשיך את רצף screens הרגיל
    if (isHolidayScreen) {
      onComplete?.();
      return;
    }

    if (page + 1 >= screens.length) onComplete();
    else onPageChange(page + 1);
  };

  const goBack = () => {
    // ⭐ אם הגענו לכאן בקפיצה ישירה, "חזור" יוצא הביתה ולא נכנס לרצף המקורי
    if (isHolidayScreen) {
      onHome?.();
      return;
    }

    if (page === 0) onBack();
    else onPageChange(page - 1);
  };

  return (
    <div className="excel-app">
      <BackButton onClick={goBack} />

      <ExcelWindow>
        {lastTableScreen && (
          <ExcelTable
            columns={lastTableScreen.columns}
            rows={lastTableScreen.rows}
            dimmed={isPopupActive}
            showConfirmButton={currentScreen.type === "table"}
            confirmLabel={currentScreen.confirmLabel}
            onConfirm={goNext}
          />
        )}

        {isPopupActive && (
          <InfoPopup
            key="popup"
            title={currentScreen.title}
            text={currentScreen.text}
            highlightText={currentScreen.highlightText}
            buttonType={currentScreen.buttonType}
            onButtonClick={goNext}
          />
        )}
      </ExcelWindow>
    </div>
  );
};

export default Excel;