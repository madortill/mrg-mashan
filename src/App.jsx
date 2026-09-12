import React from "react";
import "./css/App.css";
import { Route, Routes } from "react-router-dom";
import StartPage from "./components/start/StartPage"
import CoursePlayer from "./components/course/CoursePlayer"
import EndPage from "./components/end/End"
import logos from "./assets/images/logo.png";
import { useEffect, useState } from "react";
import { preloadAssets } from "./preloadAssets";

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    preloadAssets().then(() => {
      setAssetsLoaded(true);
    });
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
    <>
      <div className="app">
            <div className="symbols">
        <img src={logos} alt="bahad6" className="bahad6" />
      </div>
        <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/learning" element={<CoursePlayer />} />
                    <Route path="/end" element={<EndPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
