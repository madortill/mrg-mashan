import React from "react";
import { useState } from "react";
import "./css/App.css";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import StartPage from "./components/start/StartPage"
import CoursePlayer from "./components/course/CoursePlayer"
import logos from "./assets/images/logo.png";

function App() {

  return (
    <>
      <div className="app">
            <div className="symbols">
        <img src={logos} alt="bahad6" className="bahad6" />
      </div>
        <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/learning" element={<CoursePlayer />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
