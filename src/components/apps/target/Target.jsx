// import React, { useState } from 'react';
// import './Target.css';
// import target from "../../../assets/images/target.svg"
// import arrow from "../../../assets/images/arrow.svg"
// /**
//  * Target
//  * -----------------------------------------------------------------------
//  * Interactive "target" component.
//  *
//  * Behaviour:
//  *  - Starts with only the header box visible; the 4 quadrant boxes are
//  *    empty and the arrows sit in their resting position outside the target.
//  *  - Each click on the target graphic:
//  *      click 1 -> arrow #1 animates into the target, quadrant box #1 (top-left)
//  *                 reveals its text
//  *      click 2 -> arrow #2 animates in, quadrant box #2 (top-right) reveals
//  *      click 3 -> arrow #3 animates in, quadrant box #3 (bottom-left) reveals
//  *      click 4 -> arrow #4 animates in, quadrant box #4 (bottom-right) reveals
//  *      click 5 -> nothing left to reveal in the grid, the CTA button fades in
//  *  - Once the CTA is visible, clicking the target again does nothing
//  *    (isDone === true disables the button).
//  *
//  * Assets:
//  *  - `targetImgSrc` / `arrowImgSrc` are just paths (string props) so you can
//  *    swap in the real graphics whenever they're ready -- nothing else in
//  *    the component needs to change.
//  *  - The 4 arrows are rendered from the SAME `arrowImgSrc`, each one is
//  *    positioned/rotated per-quadrant purely in CSS
//  *    (see .target-arrow--top-left / --top-right / --bottom-left / --bottom-right
//  *    in Target.css). If your real asset already includes the four arrows
//  *    baked into different orientations, just pass 4 separate srcs via the
//  *    `arrowImgSrcs` prop instead (array of 4), which takes priority.
//  *
//  * Everything is driven off a single `step` integer (0..TOTAL_STEPS) so the
//  * whole flow is easy to reason about / test / reset.
//  * -----------------------------------------------------------------------
//  */

// const QUADRANT_CLASSES = [
//   'target-box--top-left',
//   'target-box--top-right',
//   'target-box--bottom-left',
//   'target-box--bottom-right',
// ];

// const DEFAULT_BOXES = [
//   { id: 'tl', text: 'הצעד יפרט כיצד מתאימים לוגיסטית ואופרטיבית לעבודה' },
//   { id: 'tr', text: 'הצעד יתמקד בהתנהלות עם הקבלת ויידע פנימי' },
//   { id: 'bl', text: 'הצעד יכלול פירוט כיצד מתמצאים היום ועובדים' },
//   { id: 'br', text: 'הצעד יכיל טיפים כיצד מתמודדים עם עומס משימות ולוחות זמנים' },
// ];

// function Target({
//   headerText = 'מטרת העל - הצעד יכיר את הממשקים העיקריים ודרכי העבודה מול מרכז הגיוס',
//   boxes = DEFAULT_BOXES,
//   buttonText = 'הבנתי',
//   targetImgSrc = "../../../assets/images/target.svg",
//   arrowImgSrc = '/assets/target/arrow.svg',
//   arrowImgSrcs = null, // optional: [srcTL, srcTR, srcBL, srcBR] overrides arrowImgSrc
//   onComplete,
//   className = '',
// }) {
//   const TOTAL_STEPS = boxes.length + 1; // N boxes + 1 extra click to reveal the CTA
//   const [step, setStep] = useState(0);

//   const isRevealed = (index) => step > index;
//   const isDone = step >= TOTAL_STEPS;

//   const handleTargetClick = () => {
//     if (isDone) return;
//     setStep((prev) => {
//       const next = Math.min(prev + 1, TOTAL_STEPS);
//       if (next === TOTAL_STEPS && typeof onComplete === 'function') {
//         onComplete();
//       }
//       return next;
//     });
//   };

//   return (
//     <div className={`target-screen ${className}`} dir="rtl">
//       <div className="target-header-box">
//         <span className="target-header-box__text">{headerText}</span>
//       </div>

//       <div className="target-grid">
//         {boxes.map((box, index) => (
//           <div
//             key={box.id}
//             className={[
//               'target-box',
//               QUADRANT_CLASSES[index] || '',
//               isRevealed(index) ? 'is-revealed' : '',
//             ].join(' ').trim()}
//           >
//             <span className="target-box__text">{box.text}</span>
//           </div>
//         ))}

//         <div className="target-center">
//           <div className="target-arrows" aria-hidden="true">
//             {boxes.map((box, index) => {
//               const quadrant = (QUADRANT_CLASSES[index] || '').replace('target-box--', '');
//               const src = (arrowImgSrcs && arrowImgSrcs[index]) || arrowImgSrc;
//               return (
//                 <img
//                   key={box.id}
//                   src={src}
//                   alt=""
//                   draggable={false}
//                   className={[
//                     'target-arrow',
//                     quadrant ? `target-arrow--${quadrant}` : '',
//                     isRevealed(index) ? 'target-arrow--merged' : '',
//                   ].join(' ').trim()}
//                 />
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             className="target-hit-area"
//             onClick={handleTargetClick}
//             disabled={isDone}
//             aria-label="לחצו על המטרה כדי לחשוף את השלבים הבאים"
//           >
//             <img src={targetImgSrc} alt="" draggable={false} className="target-image" />
//           </button>
//         </div>
//       </div>

//       <div className={`target-cta-wrap ${isDone ? 'is-revealed' : ''}`}>
//         <button
//           type="button"
//           className="target-cta"
//           onClick={onComplete}
//           tabIndex={isDone ? 0 : -1}
//           aria-hidden={!isDone}
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Target;




// function Target({
//   page,
//   onPageChange,
//   onBack,
//   onHome,
//   onComplete,
//   onNext,
// }) {

//   function handleNext() {

//     /*
//       לדוגמה יש 3 עמודים:
//       0, 1, 2
//     */

//     if (page < 2) {

//       onPageChange(
//         page + 1
//       );

//       return;
//     }


//     /*
//       כשהאפליקציה נגמרת:
//     */

//     onComplete();
//   }


//   function handleBack() {

//     /*
//       אם יש עמוד קודם
//       בתוך Target
//     */

//     if (page > 0) {

//       onPageChange(
//         page - 1
//       );

//       return;
//     }


//     /*
//       אם אנחנו בעמוד 0,
//       CoursePlayer מחליט
//       מה היה לפני Target.
//     */

//     onBack();
//   }


//   return (
//     <div className="target">

//       {page === 0 && (
//         <div>
//           עמוד Target הראשון
//         </div>
//       )}


//       {page === 1 && (
//         <div>
//           עמוד Target השני
//         </div>
//       )}


//       {page === 2 && (
//         <div>
//           עמוד Target האחרון
//         </div>
//       )}


//       <button
//         type="button"
//         onClick={
//           handleBack
//         }
//       >
//         הקודם
//       </button>


//       <button
//         type="button"
//         onClick={
//           handleNext
//         }
//       >
//         הבא
//       </button>

//     </div>
//   );
// }


// export default Target;

import React, { useState } from "react";

import "./Target.css";


import targetSvg from "../../../assets/images/target.svg";
import arrowPng from "./../../../assets/images/arrow.png";
import pointer from "./../../../assets/images/pointer.png";

const TARGET_IMG_SRC = targetSvg;
const ARROW_IMG_SRC = arrowPng;

// Reveal order: header first, then the 4 quadrants.
const REVEAL_ITEMS = [
  {
    id: "header",
    text: "מטרת העל - הצוער יכיר את הממשקים העיקריים ודרכי העבודה מול מרכז הגיוס",
  },
  {
    id: "top-left",
    text: "הצוער יפרט כיצד מוציאים חייגן ומפיצים sms",
  },
  {
    id: "top-right",
    text: "הצוער ייחשף להתנהלות עם הקפאות חיילי מילואים",
  },
  {
    id: "bottom-left",
    text: "הצוער יכיר מהם דוחות מר”ג ",
  },
  {
    id: "bottom-right",
    text: "הצוער יבין מהו מרכז גיוס ועבודתו ",
  },
];

const TOTAL_STEPS = REVEAL_ITEMS.length; // 5

function Target({ onComplete, page,
  onPageChange,
  onBack,
  onHome,
  onNext}) {
  const [step, setStep] = useState(0);

  const isRevealed = (index) => step > index;
  const isDone = step >= TOTAL_STEPS;

  function handleTargetClick() {
    if (isDone) return;
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }

  const header = REVEAL_ITEMS[0];
  const quadrants = REVEAL_ITEMS.slice(1);

  return (
    <>
    <div className="target" dir="rtl">
           <h1>מטרות הלומדה<h1/>
      <p>לחצו על המטרה<p/>
            <div
        className={`target__header-box ${isRevealed(0) ? "is-revealed" : ""}`}
      >
        <span className="target__header-text">{header.text}</span>
      </div>

      <div className="target__grid">
        {quadrants.map((box, i) => {
          const index = i + 1; // header occupies index 0
          return (
            <div
              key={box.id}
              className={`target__box target__box--${box.id} ${
                isRevealed(index) ? "is-revealed" : ""
              }`}
            >
              <span className="target__box-text">{box.text}</span>
            </div>
          );
        })}

        <div className="target__center">
          <div className="target__arrows" aria-hidden="true">
            {REVEAL_ITEMS.map((box, index) => (
              <img
                key={box.id}
                src={ARROW_IMG_SRC}
                alt=""
                draggable={false}
                className={`target__arrow target__arrow--${box.id} ${
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
            aria-label="לחצו על המטרה כדי לחשוף את השלב הבא"
          >
            <img
              src={TARGET_IMG_SRC}
              alt=""
              draggable={false}
              className="target__image"
            />
          </button>
        </div>
      </div>

      <div className={`target__cta-wrap ${isDone ? "is-revealed" : ""}`}>
        <button
          type="button"
          className="target__cta"
          onClick={onComplete}
          tabIndex={isDone ? 0 : -1}
          aria-hidden={!isDone}
        >
          הבנתי
        </button>
      </div>
    </div>
    </>
  );
}

export default Target;