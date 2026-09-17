import React from "react";
import "./css/App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StartPage from "./components/start/StartPage";
import CoursePlayer from "./components/course/CoursePlayer";
import EndPage from "./components/end/End";
import logos from "./assets/images/logo.png";
import { useEffect, useState } from "react";
import { preloadAssets } from "./preloadAssets";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<StartPage />} />
        <Route path="/learning" element={<CoursePlayer />} />
        <Route path="/end" element={<EndPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    preloadAssets().then(() => setAssetsLoaded(true));
  }, []);

  if (!assetsLoaded) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>טוענים בשבילך את הלומדה...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="symbols">
        <img src={logos} alt="bahad11" className="bahad11" />
      </div>
      <AnimatedRoutes />
    </div>
  );
}

export default App;