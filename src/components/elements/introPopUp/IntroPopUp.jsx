import React from "react";

import "./IntroPopup.css";

import character from "../../../assets/images/gili.svg";

function IntroPopup({
  open,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="intro-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="הסבר על מסך האפליקציות"
    >
      <div className="intro-popup">
        <button
          type="button"
          className="intro-popup__close"
          onClick={onClose}
          aria-label="סגירת החלון"
        >
          ×
        </button>

        <div className="intro-popup__bubble">
          <p>
            כאן נמצאות כל האפליקציות
            שעליהן נלמד.
          </p>

          <p>
            בכל פעם חפשו את האפליקציה
            הזוהרת ולחצו עליה כדי להמשיך.
          </p>
        </div>

        <img
          src={character}
          className="intro-popup__character"
          alt=""
          draggable="false"
        />
      </div>
    </div>
  );
}

export default IntroPopup;