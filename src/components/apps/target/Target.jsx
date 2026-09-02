import React, { useState } from "react";

import "./Target.css";

import targetSvg from "../../../assets/images/target.svg";
import arrowPng from "../../../assets/images/arrow.png";
import pointerPng from "../../../assets/images/pointer.png";

const REVEAL_ITEMS = [
  {
    id: "header",
    lead: "מטרת העל",
    text: "הצוער יכיר את הממשקים העיקריים ודרכי העבודה מול מרכז הגיוס",
  },
  {
    id: "top-left",
    text: "הצוער יפרט כיצד מוציאים חייגן ומפיצים SMS",
  },
  {
    id: "top-right",
    text: "הצוער ייחשף להתנהלות עם הקפאות חיילי מילואים",
  },
  {
    id: "bottom-left",
    text: "הצוער יכיר מהם דוחות מר״ג",
  },
  {
    id: "bottom-right",
    text: "הצוער יבין מהו מרכז גיוס ומהי עבודתו",
  },
];

const TOTAL_STEPS = REVEAL_ITEMS.length;

function ButtonArrow() {
  return (
    <svg
      className="target__cta-arrow"
      viewBox="0 0 28 12"
      aria-hidden="true"
    >
      <path
        d="M27 6H4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M1.5 6.86603C0.833333 6.48113 0.833333 5.51888 1.5 5.13398L7.5 1.66987C8.16667 1.28497 9 1.7661 9 2.5359V9.4641C9 10.2339 8.16667 10.715 7.5 10.3301L1.5 6.86603Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Target({ onComplete }) {
  const [step, setStep] = useState(0);

  const isRevealed = (index) => step > index;
  const isDone = step >= TOTAL_STEPS;

  function handleTargetClick() {
    if (isDone) return;

    setStep((previousStep) =>
      Math.min(previousStep + 1, TOTAL_STEPS)
    );
  }

  const header = REVEAL_ITEMS[0];
  const quadrants = REVEAL_ITEMS.slice(1);

  return (
    <section className="target" dir="rtl">
      <header className="target__heading">
        <h1 className="target__title">מטרות הלומדה</h1>

        <div className="target__instruction">
            <span>לחצו על המטרה</span>
          <img
            src={pointerPng}
            alt=""
            className="target__pointer"
            draggable="false"
            />

        </div>
      </header>

      <div
        className={`target__header-box ${
          isRevealed(0) ? "is-revealed" : ""
        }`}
      >
        <span className="target__header-text">
          <strong>{header.lead}</strong>
          {" – "}
          {header.text}
        </span>
      </div>

      <div className="target__grid">
        {quadrants.map((box, quadrantIndex) => {
          const revealIndex = quadrantIndex + 1;

          return (
            <div
              key={box.id}
              className={`target__box target__box--${box.id} ${
                isRevealed(revealIndex) ? "is-revealed" : ""
              }`}
            >
              <span className="target__box-text">{box.text}</span>
            </div>
          );
        })}

        <div className="target__center">
          <div className="target__arrows" aria-hidden="true">
            {REVEAL_ITEMS.map((item, index) => (
              <img
                key={item.id}
                src={arrowPng}
                alt=""
                draggable="false"
                className={`target__arrow target__arrow--${item.id} ${
                  isRevealed(index) ? "target__arrow--merged" : ""
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            className="target__hit-area"
            onClick={handleTargetClick}
            disabled={isDone}
            aria-label={
              isDone
                ? "כל מטרות הלומדה נחשפו"
                : "לחצו על המטרה כדי לחשוף את המטרה הבאה"
            }
          >
            <img
              src={targetSvg}
              alt=""
              draggable="false"
              className="target__image"
            />
          </button>
        </div>
      </div>

      <div
        className={`target__cta-wrap ${isDone ? "is-revealed" : ""}`}
        aria-hidden={!isDone}
      >
        <button
          type="button"
          className="target__cta"
          onClick={onComplete}
          disabled={!isDone}
          tabIndex={isDone ? 0 : -1}
        >
          <span>הבנתי</span>
          <ButtonArrow />
        </button>
      </div>
    </section>
  );
}

export default Target;
