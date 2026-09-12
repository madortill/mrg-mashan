import "./ExcelWindow.css";
import excelIcon from "../../../assets/images/apps/exel.png";

const ExcelWindow = ({ children, name }) => (
  <div className="excel-window">
    <div className="excel-window__titlebar">
      <div className="excel-window__icon">
        <img className="excel-window__icon-x" src={excelIcon}></img>
      </div>
      <span className="excel-window__title">{name}</span>
      <span className="excel-window__title">EXCEL</span>
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