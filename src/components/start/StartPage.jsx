




import "./start.css";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import desk from "../../assets/images/desk_wide.svg";
import plant from "../../assets/images/plant.svg";
import backgroundDecor from "../../assets/images/background-decor.svg";

import laptopOpening from "../../assets/images/computerClean.svg";

import searchIcon from "../../assets/images/search_icon.svg";
import rope from "../../assets/images/rope.svg";
import openingIcon from "../../assets/images/BHD11Round.png";

import HomePage from "../../learningCom/homepage/HomePage";
const INTRO_DURATION_MS = 3900;

const FLIGHT_PATH =
  "M -45 145 C 4 76 71 78 72 119 C 73 158 123 160 150 121 C 173 87 149 57 117 68 C 84 80 91 124 134 132 C 194 142 224 88 253 57 C 285 23 320 44 333 77 C 346 110 375 91 414 27";

/* ========================================
   צורת המטוס

   המטוס מצויר כאן כ-SVG,
   לכן אין צורך בתמונת מטוס נוספת.
======================================== */

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


/* ========================================
   המטוס והמסלול

   המסלול נחשף בהדרגה,
   והמטוס מתקדם בדיוק לאורכו.
======================================== */

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

        <PlaneShape />
      </g>
    </svg>
  );
}akl


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

      navigate("/learning");

}
function StartPage() {
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
        src={logos}
        className="start-page__logos"
        alt="לוגואים"
        draggable="false"
      />

      <LaptopIntro
        onOpened={() =>
          setLaptopIsOpen(true)
        }
      >
        <StartScreenContent
          visible={laptopIsOpen}
          onStart={() =>
            navigate(
              "/learning/desktop",
              { replace: true }
            )
          }
        />
      </LaptopIntro>
    </section>
  );
}



function StartPage({ nextPage }) {
  const [phase, setPhase] = useState("start");

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (prefersReducedMotion) {
      setPhase("start");
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase("start");
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main
      className={`opening-page ${
        phase === "start"
          ? "opening-page-start"
          : "opening-page-intro"
      }`}
    >
      <section className="opening-scene">
        <img
          src={backgroundDecor}
          className="background-decoration"
          alt=""
          draggable="false"
        />

        <img
          src={desk}
          className="desk"
          alt=""
          draggable="false"
        />

        <img
          src={plant}
          className="plant"
          alt=""
          draggable="false"
        />

        {phase === "intro" ? (
          <LaptopIntro />
        ) : (
          <StartLaptop nextPage={nextPage} />
        )}
      </section>
    </main>
  );
}

export default StartPage;