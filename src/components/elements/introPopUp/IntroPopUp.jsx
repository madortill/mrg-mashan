import React from "react";

import "./IntroPopup.css";


import character
  from "../../../assets/images/gili.svg";


function IntroPopup({
  onComplete,
}) {
  function handleClose() {
    onComplete();
  }


  return (
    <div
      className="intro-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="מבוא ללומדה"
    >
      <div className="intro-popup">

        <button
          type="button"
          className="intro-popup__close"
          onClick={handleClose}
          aria-label="סיום המבוא"
        >
          ×
        </button>


        <div className="intro-popup__content">

          <div className="intro-popup__bubble">

            <h3>
              היי! אני דנה הקצינת משא״ן מילואים
            </h3>

            <p>
               אני אלווה אתכם במהלך הלומדה, ואהיה איתכם בכל דוח. נעבור על כל המידע שתצטרכו כדי להיות גם כמוני :)
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
    </div>
  );
}


export default IntroPopup;