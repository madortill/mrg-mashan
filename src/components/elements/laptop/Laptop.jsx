import React, {
  useLayoutEffect,
  useRef,
} from "react";

import "./Laptop.css";

import homeLaptop
  from "../../../assets/images/home-wide.svg";

import emptyLaptop
  from "../../../assets/images/home-desktop-clean-wide.svg";


const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1024;


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

      const scale = Math.min(
        availableWidth / DESIGN_WIDTH,
        availableHeight / DESIGN_HEIGHT
      );

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
  );
}


export default Laptop;