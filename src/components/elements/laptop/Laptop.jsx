// import React, {
//   useLayoutEffect,
//   useRef,
// } from "react";

// import "./Laptop.css";

// import homeLaptop
//   from "../../../assets/images/home-wide.svg";

// import emptyLaptop
//   from "../../../assets/images/home-desktop-clean-wide.svg";


// const DESIGN_WIDTH = 1440;
// const DESIGN_HEIGHT = 1024;


// function Laptop({
//   variant = "empty",
//   children,
// }) {
//   const wrapperRef = useRef(null);

//   const laptopImage =
//     variant === "home"
//       ? homeLaptop
//       : emptyLaptop;


//   useLayoutEffect(() => {
//     const wrapper =
//       wrapperRef.current;

//     if (!wrapper) {
//       return undefined;
//     }


//     function updateScale() {
//       const availableWidth =
//         wrapper.clientWidth;

//       const availableHeight =
//         wrapper.clientHeight;

//       const scale = Math.min(
//         availableWidth / DESIGN_WIDTH,
//         availableHeight / DESIGN_HEIGHT
//       );

//       wrapper.style.setProperty(
//         "--laptop-scale",
//         scale
//       );
//     }


//     updateScale();

//     const resizeObserver =
//       new ResizeObserver(updateScale);

//     resizeObserver.observe(wrapper);

//     window.addEventListener(
//       "resize",
//       updateScale
//     );


//     return () => {
//       resizeObserver.disconnect();

//       window.removeEventListener(
//         "resize",
//         updateScale
//       );
//     };
//   }, []);


//   return (
//     <div
//       ref={wrapperRef}
//       className="laptop"
//     >
//       <div className="laptop__stage">

//         <img
//           src={laptopImage}
//           className="laptop__image"
//           alt=""
//           draggable="false"
//         />


//         <div className="laptop__screen">
//           {children}
//         </div>

//       </div>
//     </div>
//   );
// }


// export default Laptop;
import React, {
  useLayoutEffect,
  useRef,
} from "react";

import "./Laptop.css";
import { motion } from "framer-motion";

import homeLaptop
  from "../../../assets/images/home-wide.svg";

import emptyLaptop
  from "../../../assets/images/home-desktop-clean-wide.svg";


const DESIGN_WIDTH = 1650;
const DESIGN_HEIGHT = 1024;

// רצפת ביטחון אם המשתנה ב-CSS לא נקרא מסיבה כלשהי
const FALLBACK_MIN_SCALE = 0.4;


function Laptop({
  variant = "empty",
  children,
}) {
  const wrapperRef = useRef(null);

  const laptopImage =
    variant === "home"
      ? homeLaptop
      : emptyLaptop;


  useLayoutEffect(() => {
    const wrapper =
      wrapperRef.current;

    if (!wrapper) {
      return undefined;
    }


    function updateScale() {
      const availableWidth =
        wrapper.clientWidth;

      const availableHeight =
        wrapper.clientHeight;

      const byWidth =
        availableWidth / DESIGN_WIDTH;

      const byHeight =
        availableHeight / DESIGN_HEIGHT;

      // מצב "contain" רגיל
      let scale = Math.min(byWidth, byHeight);

      // קוראים את רצפת הסקייל שהוגדרה ב-CSS לפי ה-breakpoint הנוכחי
      const minScaleRaw = getComputedStyle(wrapper)
        .getPropertyValue("--laptop-min-scale")
        .trim();

      const minScale =
        parseFloat(minScaleRaw) || FALLBACK_MIN_SCALE;

      // לא יורדים מתחת לרצפה - גם אם זה אומר
      // שהלפטופ "יגלוש" מעבר לגובה/רוחב הזמינים
      // (החיתוך קורה אוטומטית דרך overflow:hidden,
      // וההצמדה לתחתית נשמרת כי transform-origin הוא center bottom)
      if (scale < minScale) {
        scale = minScale;
      }

      wrapper.style.setProperty(
        "--laptop-scale",
        scale
      );
    }


    updateScale();

    const resizeObserver =
      new ResizeObserver(updateScale);

    resizeObserver.observe(wrapper);

    window.addEventListener(
      "resize",
      updateScale
    );


    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateScale
      );
    };
  }, []);


  return (
    <div
      ref={wrapperRef}
      className="laptop"
    >
      <div className="laptop__stage">

        <img
          src={laptopImage}
          className="laptop__image"
          alt=""
          draggable="false"
        />


        <div className="laptop__screen">
          {children}
        </div>

      </div>
    </div>
  //     <motion.div
  //   layoutId="app-laptop"
  //   ref={wrapperRef}
  //   className="laptop"
  //   // transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  //   initial={{ opacity: 0 }}
  // animate={{ opacity: 1 }}
  // transition={{ duration: 0.35, delay: 0.25 }}
  // >
  //   <div className="laptop__stage">
  //     <img
  //       src={laptopImage}
  //       className="laptop__image"
  //       alt=""
  //       draggable="false"
  //     />
  //     <div className="laptop__screen">{children}</div>
  //   </div>
  // </motion.div>
  );
}


export default Laptop;