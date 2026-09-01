
import "./homePage.css";
import React, { useEffect, useState } from "react";

import desk from "../../../assets/images/desk_wide.svg";
import plant from "../../../assets/images/plant.svg";
import backgroundDecor from "../../../assets/images/background-decor.svg";

import laptopOpening from "../../../assets/images/computer_home.png";

const HomePage = () => { 
  return ( 
    <> 
      <section className="opening-scene"> 
        <img src={backgroundDecor} className="background-decoration" alt="" draggable="false" /> 
        <img src={desk} className="desk" alt="" draggable="false" /> 
        <img src={plant} className="plant" alt="" draggable="false" /> 
      </section> 
    </> 
  ); 
} 

export default HomePage;
