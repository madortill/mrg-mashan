import "./BackButton.css";
import backArrow from "../../../assets/images/next-icon.svg";

const BackButton = ({ onClick, label = "חזור" }) => (
  <button className="back-button" onClick={onClick} aria-label={label}>
    <img src={backArrow} alt="" className="back-button__icon" />
    <span className="back-button__label">{label}</span>
  </button>
);

export default BackButton;