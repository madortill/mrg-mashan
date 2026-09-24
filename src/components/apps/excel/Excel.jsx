import { useEffect, useMemo, useState } from "react";
import "./Excel.css";
import ExcelWindow from "./ExcelWindow";
import ExcelTable from "./ExcelTable";
import ExcelTableNav from "./ExcelTableNav";
import InfoPopup from "./InfoPopup";
import BackButton from "../../elements/backButton/BackButton";
import { screens, holidayReadinessScreen, HOLIDAY_READINESS_PAGE } from "./excelData";

const Excel = ({ page = 0, onPageChange, onBack, onHome, onComplete, onSpeechChange }) => {
  const isHolidayScreen = page === HOLIDAY_READINESS_PAGE;

  // ⭐ חדש - מצב "עיון" פנימי בלבד, לא נוגע בהתקדמות האמיתית של הלומדה
  const [browseKey, setBrowseKey] = useState(null);

  // ⭐ אם ה-page האמיתי השתנה מבחוץ, יוצאים ממצב עיון
  useEffect(() => {
    setBrowseKey(null);
  }, [page]);

  const isBrowsing = browseKey !== null;
  const effectiveIsHoliday = isBrowsing
    ? browseKey === HOLIDAY_READINESS_PAGE
    : isHolidayScreen;
  const effectivePage = isBrowsing ? browseKey : page;

  const currentScreen = effectiveIsHoliday
    ? holidayReadinessScreen
    : screens[effectivePage];
  const isPopupActive = !isBrowsing && currentScreen.type === "popup";

  const lastTableScreen = effectiveIsHoliday
    ? holidayReadinessScreen
    : isBrowsing
      ? screens[effectivePage] // בעיון תמיד מציגים ישירות את הטבלה שנבחרה
      : screens
          .slice(0, effectivePage + 1)
          .reverse()
          .find((s) => s.type === "table");

  // ⭐ כל הטבלאות ש"כבר עברנו" - לצורך תפריט הניווט
  const availableTables = useMemo(() => {
    const mainTables = screens
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => s.type === "table")
      .filter((s) => isHolidayScreen || s.idx <= page);

    const entries = mainTables.map((s) => ({ key: s.idx, name: s.tableName }));

    if (isHolidayScreen) {
      entries.push({ key: HOLIDAY_READINESS_PAGE, name: holidayReadinessScreen.tableName });
    }

    return entries;
  }, [page, isHolidayScreen]);

  useEffect(() => {
    const text = !isPopupActive ? lastTableScreen?.bubbleText ?? "" : "";
    onSpeechChange?.(text);
  }, [effectivePage, isBrowsing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => onSpeechChange?.("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = () => {
    if (isBrowsing) {
      setBrowseKey(null); // "חזרה" רק חוזר למקום האמיתי
      return;
    }
    if (isHolidayScreen) {
      onComplete?.();
      return;
    }
    if (page + 1 >= screens.length) onComplete();
    else onPageChange(page + 1);
  };

  const goBack = () => {
    if (isBrowsing) {
      setBrowseKey(null);
      return;
    }
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

      <ExcelWindow
        name={
          <ExcelTableNav
            label={lastTableScreen?.tableName}
            tables={availableTables}
            currentKey={effectiveIsHoliday ? HOLIDAY_READINESS_PAGE : effectivePage}
            onSelect={(key) => setBrowseKey(key)}
          />
        }
      >
        {lastTableScreen && (
          <ExcelTable
            columns={lastTableScreen.columns}
            rows={lastTableScreen.rows}
            dimmed={isPopupActive}
            showConfirmButton={currentScreen.type === "table"}
            confirmLabel={isBrowsing ? "חזרה" : currentScreen.confirmLabel}
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