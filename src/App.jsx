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

// ⭐ מציג את הרמז לסיבוב כל פעם שהמכשיר עובר למצב אנכי
// (לא רק בטעינה הראשונה), על ידי שינוי ה-key בכל מעבר.
function RotateHint() {
  const [hintKey, setHintKey] = useState(0);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(max-width: 600px) and (orientation: portrait)").matches
  );

  useEffect(() => {
    const query = window.matchMedia(
      "(max-width: 600px) and (orientation: portrait)"
    );

    function handleChange(event) {
      if (event.matches) {
        // ⭐ נכנסנו למצב אנכי - מעלים את ה-key כדי להריץ את האנימציה מההתחלה
        setHintKey((previous) => previous + 1);
      }

      setIsPortrait(event.matches);
    }

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  if (!isPortrait) {
    return null;
  }

  return (
    <div className="rotate-hint" key={hintKey} aria-hidden="true">
      <span className="rotate-hint__icon" />
      <span className="rotate-hint__text">
        סובבו את המכשיר לרוחב לחוויה הטובה ביותר
      </span>
    </div>
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

      <RotateHint />

      <AnimatedRoutes />
    </div>
  );
}

export default App;