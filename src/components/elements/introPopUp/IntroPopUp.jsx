import React from "react";

import "./IntroPopUp.css";

import character from "../../../assets/images/gili.svg";

import speechBubble from "../../../assets/images/bubbleText.svg";

function IntroPopup({
  title = "היי! אני דנה קצינת המשא״ן מילואים.",
  text = "אני אלווה אתכם במהלך הלומדה, ואהיה איתכם בכל דוח.",
  onClose,
}) {
  return (
    <div
      className="intro-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-popup-title"
    >
      <div className="intro-popup">
        <button
          type="button"
          className="intro-popup__close"
          onClick={onClose}
          aria-label="סגירת המבוא"
        >
          ×
        </button>

        <div className="intro-popup__content">
          <div className="intro-popup__bubble">
            <img
              src={speechBubble}
              className="intro-popup__bubble-image"
              alt=""
              draggable="false"
            />

            <div className="intro-popup__text">
              <h3 id="intro-popup-title">{title}</h3>

              <p>{text}</p>
            </div>
          </div>

          <img
            src={character}
            className="intro-popup__character"
            alt="דנה, קצינת משא״ן מילואים"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}

export default IntroPopup;