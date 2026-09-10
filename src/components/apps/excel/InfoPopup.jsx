import "./InfoPopup.css";
import checkIcon from "../../../assets/images/vi.svg";
import arrowIcon from "../../../assets/images/arrowExcel.svg";
import gili from "../../../assets/images/gili.svg";

const InfoPopup = ({ title, text, highlightText, buttonType = "check", onButtonClick }) => (
  <div className="popup-overlay">
    <div className="popup-card">
      <button
        className={`popup-card__side-btn popup-card__side-btn--${buttonType}`}
        onClick={onButtonClick}
        aria-label={buttonType === "check" ? "אישור" : "המשך"}
      >
        <img src={buttonType === "check" ? checkIcon : arrowIcon} alt="" />
      </button>

      <div className="popup-card__content">
        {title && <h3 className="popup-card__title">{title}</h3>}
        <p className="popup-card__text">{text}</p>
        {highlightText && <span className="popup-card__highlight">{highlightText}</span>}
      </div>
    </div>
    <img src={gili} className="info-popup__gili" alt="Gili" />
  </div>
);

export default InfoPopup;