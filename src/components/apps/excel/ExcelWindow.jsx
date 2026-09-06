import "./ExcelWindow.css";

const ExcelWindow = ({ children }) => (
  <div className="excel-window">
    <div className="excel-window__titlebar">
      <span className="excel-window__title">EXCEL</span>
      <div className="excel-window__icon">
        <span className="excel-window__icon-x">X</span>
      </div>
    </div>
    <div className="excel-window__menu">
      {["קובץ", "בית", "הוספה", "עיצוב עמוד", "נוסחאות", "נתונים", "סקירה", "עזרה"].map((item, i) => (
        <span key={item} className={`excel-window__menu-item ${i === 1 ? "is-active" : ""}`}>
          {item}
        </span>
      ))}
    </div>
    <div className="excel-window__body">{children}</div>
  </div>
);

export default ExcelWindow;