




import "./start.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import desk from "../../assets/images/desk_wide.svg";
import plant from "../../assets/images/plant.svg";
import backgroundDecor from "../../assets/images/background-decor.svg";

import laptopOpening from "../../assets/images/computerClean.svg";
import { motion } from "framer-motion";

import logo from "../../assets/images/logo.png";
import searchIcon from "../../assets/images/search_icon.svg";
import rope from "../../assets/images/rope2.svg";
import openingIcon from "../../assets/images/BHD11Round.png";
import logoWatermark from "../../assets/images/BHD11END.svg";
import mapalRope from "../../assets/images/mapalRope2.svg";
import LaptopOutro from "../end/LaptopOutro.jsx";


const FLIGHT_PATH =
  "M -45 145 C 4 76 71 78 72 119 C 73 158 123 160 150 121 C 173 87 149 57 117 68 C 84 80 91 124 134 132 C 194 142 224 88 253 57 C 285 23 320 44 333 77 C 346 110 375 91 414 27";



function PlaneShape() {
  return (
    <g transform="translate(-25 -20)">
      <path
        className="plane-main-shape"
        d="M3 19 L48 2 L32 40 L22 26 L11 34 L15 23 Z"
      />

      <path
        className="plane-fold-shape"
        d="M15 23 L35 11 L22 26"
      />

      <path
        className="plane-detail-shape"
        d="M22 26 L32 40"
      />
    </g>
  );
}



function AnimatedPlane() {
  return (
    <svg
      className="flight-graphic"
      viewBox="0 0 430 180"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask
          id="opening-flight-mask"
          maskUnits="userSpaceOnUse"
          x="-60"
          y="-20"
          width="520"
          height="240"
        >
          <path
            className="flight-route-mask"
            d={FLIGHT_PATH}
            pathLength="1"
          />
        </mask>
      </defs>

      {/* המסלול המקווקו */}
      <path
        id="opening-flight-route"
        className="flight-route"
        d={FLIGHT_PATH}
        mask="url(#opening-flight-mask)"
      />

      {/* המטוס */}
      <g className="flight-plane">
      
<animateMotion
  dur="3.2s"
  begin="0.2s"
  fill="freeze"
  rotate="auto"
  calcMode="paced"
>
  <mpath href="#opening-flight-route" />
</animateMotion>
<animateTransform
  attributeName="transform"
  type="rotate"
  additive="sum"
  from="0"
  to="-15"           /* ← כאן תכייל את המספר */
  begin="3.2s"
  dur="0.01s"
  fill="freeze"
/>

        <PlaneShape />
      </g>
    </svg>
  );
}


/* ========================================
   אנימציית פתיחת הלפטופ

   משתמשים באותה תמונה פעמיים:
   שכבה אחת לבסיס ושכבה אחת למכסה.
======================================== */

function LaptopIntro() {
  return (
    <div className="intro-laptop" aria-hidden="true">
      {/* שומר על יחס הגובה והרוחב של התמונה */}
      <img
        src={laptopOpening}
        className="intro-laptop-sizer"
        alt=""
        draggable="false"
      />

      {/* החלק התחתון של המחשב */}
      <div className="intro-laptop-base">
        <img
          src={laptopOpening}
          className="intro-laptop-part"
          alt=""
          draggable="false"
        />
      </div>

      {/* המכסה שנפתח */}
      <div className="intro-laptop-lid">
        <img
          src={laptopOpening}
          className="intro-laptop-part"
          alt=""
          draggable="false"
        />

        {/* המסך שנדלק */}
        <div className="intro-screen-power">
          <span className="intro-boot-line" />

          <span className="intro-power-core" />
        </div>
      </div>

      <div className="intro-laptop-shadow" />
    </div>
  );
}


/* ========================================
   מסך ה-Start לאחר סיום הפתיחה
======================================== */

function StartLaptop({ nextPage }) {
  return (
    <>
      <div className="welcome-bar">
        <span className="welcome-text">
          ברוכים הבאים!
        </span>

        <img
          src={searchIcon}
          className="welcome-search-icon"
          alt=""
          draggable="false"
        />
      </div>

      <div className="laptop-wrapper">
        <img
          src={laptopOpening}
          className="laptop-image"
          alt=""
          draggable="false"
        />

        <div className="laptop-screen">
          <img
            src={rope}
            className="screen-rope"
            alt=""
            draggable="false"
          />

          <AnimatedPlane />

          <div className="screen-content">
            <h1 className="opening-title">
              לומדת ממשקי עבודה מרכז גיוס
            </h1>

            <img
              src={openingIcon}
              className="opening-icon"
              alt=""
              draggable="false"
            />

            <button
              type="button"
              className="start-button"
              onClick={() => nextPage?.()}
            >
              <span>להתחלת הלומדה</span>

              <span
                className="start-button-arrow"
                aria-hidden="true"
              >
                ›
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
const nextPage= ()=>{
      const navigate = useNavigate();
    console.log("press");
      navigate("/learning");

}
function start() {
  const navigate = useNavigate();

  const [laptopIsOpen, setLaptopIsOpen] =
    useState(false);

  return (
    <section className="start-page">
      <img
        src={backgroundDecor}
        className="start-page__background"
        alt=""
        draggable="false"
      />

      <img
        src={desk}
        className="start-page__desk"
        alt=""
        draggable="false"
      />

      <img
        src={plant}
        className="start-page__plant"
        alt=""
        draggable="false"
      />

      <img
        src={logo}
        className="start-page__logos"
        alt="לוגואים"
        draggable="false"
      />

    </section>
  );
}
export default function StartPage({ nextPage }) {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const titleRef = useRef(null);
  const aboutButtonRef = useRef(null);

  useEffect(() => {
    if (ready) {
      titleRef.current?.focus({ preventScroll: true });
    }
  }, [ready]);

  const handleStartClick = () => {
    if (typeof nextPage === "function") {
      nextPage();
    } else {
      navigate("/learning");
    }
  };

  const closeAbout = () => {
    setShowAbout(false);
    aboutButtonRef.current?.focus();
  };

  return (
    <main
      className="opening-page opening-page--motion"
      dir="rtl"
    >
      <section className="opening-scene">
        <img
          src={backgroundDecor}
          className="background-decoration"
          alt=""
          draggable={false}
        />

        <img
          src={desk}
          className="desk"
          alt=""
          draggable={false}
        />

        <img
          src={plant}
          className="plant"
          alt=""
          draggable={false}
        />

        {/* <img
          src={logo}
          className="opening-brand"
          alt="לוגואי הארגונים"
          draggable={false}
        /> */}

        {ready && (
          <div className="welcome-bar">
            <span className="welcome-text">
              ברוכים הבאים!
            </span>

            <img
              src={searchIcon}
              className="welcome-search-icon"
              alt=""
              draggable={false}
            />
          </div>
        )}

<motion.div
  layoutId="app-laptop"
  className="laptop-wrapper laptop-wrapper--motion"
  // transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    initial={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.35 }}
>          <LaptopOutro
            opening
            duration={3900}
            framing="full"
            lidLogoSrc={logoWatermark}
            onComplete={() => setReady(true)}
          >
            {ready && (
              <div className="laptop-screen laptop-screen--motion">
                <img
                  src={rope}
                  className="screen-rope"
                  alt=""
                  draggable={false}
                />

                <AnimatedPlane />

                <div className="screen-content">
                  <h1
                    className="opening-title"
                    ref={titleRef}
                    tabIndex={-1}
                  >
                    לומדת ממשקי עבודה מרכז גיוס
                  </h1>

                  <img
                    src={openingIcon}
                    className="opening-icon"
                    alt=""
                    draggable={false}
                  />

                  <button
                    type="button"
                    className="start-button"
                    onClick={handleStartClick}
                  >
                    <span>להתחלת הלומדה</span>

                    <span
                      className="start-button-arrow"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </button>
                </div>
              </div>
            )}
          </LaptopOutro>
        </motion.div>
      </section>

      <div
        className="start-about"
        onKeyDown={(event) => {
          if (event.key === "Escape" && showAbout) {
            event.preventDefault();
            closeAbout();
          }
        }}
      >
        <button
          ref={aboutButtonRef}
          type="button"
          className="start-about__toggle"
          aria-expanded={showAbout}
          aria-controls="start-about-content"
          onClick={() => setShowAbout((value) => !value)}
        >
          {showAbout ? "סגירת אודות" : "אודות"}
        </button>

        <div
          id="start-about-content"
          className="start-about__card"
          hidden={!showAbout}
          role="region"
          aria-label="אודות הלומדה"
        >
          <img src={mapalRope}className="mapalRope"></img>
          <dl className="start-about__details">
            <div>
              <dt>מפתחת ראשית:</dt>
              <dd>רב"ט רעות מנה</dd>
            </div>

            <div>
              <dt>גרפיקה:</dt>
              <dd>
                רב"ט רעות מנה
                <br />
                רב"ט דינה ליפשיץ
              </dd>
            </div>

            <div>
              <dt>מומחית תוכן:</dt>
              <dd>סג"ם נויה חן</dd>
            </div>

            <div>
              <dt>רמ"ד טי"ל:</dt>
              <dd>סמ"ר קטיה מדבדב</dd>
            </div>

            <div>
              <dt>גרסה:</dt>
              <dd>ספטמבר 2026</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}