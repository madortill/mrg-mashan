import React from "react";

import "./laptop.css";

import homeLaptop
  from "../../../assets/images/computerHome.svg";

import emptyLaptop
  from "../../../assets/images/emptyLaptop.svg";

import rope
  from "../../../assets/images/color_rope.svg";

function Laptop({
  variant = "empty",
  children,
}) {
  const isHome =
    variant === "home";

  const laptopImage =
    isHome
      ? homeLaptop
      : emptyLaptop;


  return (
    <div className="laptop">

      <img
        src={laptopImage}
        className="laptop__image"
        alt=""
        draggable="false"
      />


      <div className="laptop__screen">

        {/* {isHome && (
          <img
            src={rope}
            className="laptop__rope"
            alt=""
            draggable="false"
          />
        )} */}

        {children}

      </div>

    </div>
  );
}
export default Laptop;