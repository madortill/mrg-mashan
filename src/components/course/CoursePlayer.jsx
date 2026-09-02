import React, { useEffect, useMemo, useState } from "react";

import "./CoursePlayer.css";
// import "./CoursePlayer.responsive.css";

import Navbar from "../elements/navbar/Navbar";
import Target from "../apps/target/Target.jsx";
import GoogleYnet from "../apps/google/GoogleYnet";
import IntroPopUp from "../elements/introPopUp/IntroPopUp.jsx";
import Laptop from "../elements/laptop/Laptop";
import DesktopHub from "../pages/DesktopHub/DesktopHub";

import { courseApps as desktopCourseApps } from "./CourseApp";

import desk from "../../assets/images/desk_wide.svg";
import plant from "../../assets/images/plant.svg";
import backgroundDecor from "../../assets/images/background-decor.svg";

const STORAGE_KEY = "mrg-mashan:course-progress:v1";

const HUB_NAVBAR_TITLE = "לחצו על האפליקציה הזוהרת";
const INTRO_NAVBAR_TITLE = "לחצו על השרוך הזוהר";

/*
  המבוא אינו אפליקציה. הוא נפתח מהשרוך ולכן הוא לא נמצא במערך הזה
  ולא תופס את אינדקס 0. Target היא האפליקציה הראשונה באמת.
*/
const APP_ORDER = [
  "target",
  "chrome",
  "excel",
  "yanshuf",
  "outlook",
  "people",
];

const APP_CONTENT = {
  target: {
    label: "Target",
    navbarTitle: "מטרות הלומדה",
    component: Target,
    laptopVariant: "empty",
  },
  chrome: {
    label: "Google Chrome",
    navbarTitle: "מהו מרכז גיוס? google",
    component: GoogleYnet,
    laptopVariant: "empty",
  },
  excel: {
    label: "Excel",
    navbarTitle: "כאן תכתבי את הכותרת של Excel",
    component: null,
    laptopVariant: "empty",
  },
  yanshuf: {
    label: "ינשוף",
    navbarTitle: "כאן תכתבי את הכותרת של ינשוף",
    component: null,
    laptopVariant: "empty",
  },
  outlook: {
    label: "Outlook",
    navbarTitle: "כאן תכתבי את הכותרת של Outlook",
    component: null,
    laptopVariant: "empty",
  },
  people: {
    label: "אנשים",
    navbarTitle: "כאן תכתבי את הכותרת של אנשים",
    component: null,
    laptopVariant: "empty",
  },
};

/*  כך CoursePlayer ו-DesktopHub עובדים מול אותו מערך ולא מול שני מערכים סותרים.
*/
const desktopAppsById = new Map(
  desktopCourseApps.map((app) => [app.id, app])
);

const COURSE_APPS = APP_ORDER.map((id) => ({
  ...(desktopAppsById.get(id) ?? {}),
  id,
  ...APP_CONTENT[id],
}));

const initialAppPages = Object.fromEntries(
  COURSE_APPS.map((app) => [app.id, 0])
);

function createDefaultProgress() {
  return {
    screen: "hub",
    highestUnlockedIndex: 0,
    introPopupSeen: false,
    visitedApps: [],
    completedApps: [],
    appPages: { ...initialAppPages },
  };
}

function getInitialProgress() {
  const fallback = createDefaultProgress();

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    const validIds = new Set(APP_ORDER);

    const rawVisited = Array.isArray(parsed.visitedApps)
      ? parsed.visitedApps
      : [];
    const rawCompleted = Array.isArray(parsed.completedApps)
      ? parsed.completedApps
      : [];

    /* תיקון שקט למצב שנשמר בגרסה שבה popUp היה אפליקציה. */
    const hadLegacyPopup =
      parsed.screen === "popUp" ||
      rawVisited.includes("popUp") ||
      rawCompleted.includes("popUp");

    const savedHighest = Number.isInteger(parsed.highestUnlockedIndex)
      ? parsed.highestUnlockedIndex
      : 0;

    const normalizedHighest = Math.max(
      0,
      Math.min(
        COURSE_APPS.length,
        savedHighest - (hadLegacyPopup ? 1 : 0)
      )
    );

    return {
      ...fallback,
      ...parsed,
      screen: validIds.has(parsed.screen) ? parsed.screen : "hub",
      highestUnlockedIndex: normalizedHighest,
      introPopupSeen: Boolean(parsed.introPopupSeen),
      visitedApps: rawVisited.filter((id) => validIds.has(id)),
      completedApps: rawCompleted.filter((id) => validIds.has(id)),
      appPages: {
        ...initialAppPages,
        ...(parsed.appPages ?? {}),
      },
    };
  } catch (error) {
    console.error("Could not load course progress:", error);
    return fallback;
  }
}

function CoursePlayer({ onExit }) {
  const [progress, setProgress] = useState(getInitialProgress);

  /*
    זהו מצב תצוגה מקומי בלבד: רענון לא פותח את הפופ-אפ מעצמו.
    introPopupSeen נשמר רק אחרי שהמשתמש סגר אותו.
  */
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!isIntroOpen) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsIntroOpen(false);
        setProgress((previous) => ({
          ...previous,
          introPopupSeen: true,
        }));
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isIntroOpen]);

  const highlightedAppId = useMemo(() => {
    if (!progress.introPopupSeen) {
      return null;
    }

    return COURSE_APPS[progress.highestUnlockedIndex]?.id ?? null;
  }, [progress.highestUnlockedIndex, progress.introPopupSeen]);

  function openIntroPopup() {
    if (!progress.introPopupSeen) {
      setIsIntroOpen(true);
    }
  }

  function closeIntroPopup() {
    setIsIntroOpen(false);
    setProgress((previous) => ({
      ...previous,
      introPopupSeen: true,
    }));
  }

  function canOpenApp(appId) {
    if (!progress.introPopupSeen || isIntroOpen) {
      return false;
    }

    const index = COURSE_APPS.findIndex((app) => app.id === appId);

    if (index === -1) {
      return false;
    }

    return (
      index <= progress.highestUnlockedIndex ||
      progress.visitedApps.includes(appId) ||
      progress.completedApps.includes(appId)
    );
  }

  function openApp(appId) {
    if (!canOpenApp(appId)) {
      return;
    }

    setProgress((previous) => ({
      ...previous,
      screen: appId,
      visitedApps: Array.from(new Set([...previous.visitedApps, appId])),
    }));
  }

  function goHome() {
    setIsIntroOpen(false);
    setProgress((previous) => ({
      ...previous,
      screen: "hub",
    }));
  }

  function setAppPage(appId, page) {
    setProgress((previous) => ({
      ...previous,
      appPages: {
        ...previous.appPages,
        [appId]: page,
      },
    }));
  }

  function finishApp(appId, destination = "home") {
    const appIndex = COURSE_APPS.findIndex((app) => app.id === appId);

    if (appIndex === -1) {
      return;
    }

    const nextIndex = appIndex + 1;
    const nextApp = COURSE_APPS[nextIndex];

    setProgress((previous) => {
      const completedApps = Array.from(
        new Set([...previous.completedApps, appId])
      );
      const highestUnlockedIndex = Math.max(
        previous.highestUnlockedIndex,
        Math.min(nextIndex, COURSE_APPS.length)
      );

      if (destination === "next" && nextApp) {
        return {
          ...previous,
          screen: nextApp.id,
          completedApps,
          highestUnlockedIndex,
          visitedApps: Array.from(
            new Set([...previous.visitedApps, nextApp.id])
          ),
        };
      }

      return {
        ...previous,
        screen: "hub",
        completedApps,
        highestUnlockedIndex,
      };
    });
  }

  function goToPreviousApp(appId) {
    const index = COURSE_APPS.findIndex((app) => app.id === appId);

    if (index <= 0) {
      goHome();
      return;
    }

    openApp(COURSE_APPS[index - 1].id);
  }

  const activeApp = COURSE_APPS.find((app) => app.id === progress.screen);

  const navbarTitle =
    progress.screen === "hub"
      ? progress.introPopupSeen
        ? HUB_NAVBAR_TITLE
        : INTRO_NAVBAR_TITLE
      : activeApp?.navbarTitle ?? "";

  const navbarItems = COURSE_APPS.map((app, index) => {
    const isCurrent = progress.screen === app.id;
    const isCompleted = progress.completedApps.includes(app.id);
    const isVisited = progress.visitedApps.includes(app.id);
    const isUnlocked =
      progress.introPopupSeen &&
      (index <= progress.highestUnlockedIndex || isVisited || isCompleted);

    let status = "locked";

    if (isCurrent) status = "current";
    else if (isCompleted) status = "completed";
    else if (isUnlocked) status = "next";

    return {
      id: app.id,
      label: app.label,
      status,
      disabled: !isUnlocked,
    };
  });

  function renderHub({ blockApps = false } = {}) {
    return (
      <DesktopHub
        apps={COURSE_APPS}
        currentAppId={blockApps ? null : highlightedAppId}
        completedApps={progress.completedApps}
        visitedApps={progress.visitedApps}
        introCompleted={progress.introPopupSeen}
        showRopeGlow={!progress.introPopupSeen && !isIntroOpen}
        isInteractionBlocked={blockApps || isIntroOpen}
        onRopeClick={openIntroPopup}
        onOpenApp={openApp}
      />
    );
  }

  function renderScreen() {
    if (progress.screen === "hub") {
      return (
        <Laptop variant="home">
          {renderHub()}

          {isIntroOpen && (
            <IntroPopUp
              onComplete={closeIntroPopup}
              onClose={closeIntroPopup}
            />
          )}
        </Laptop>
      );
    }

    if (!activeApp) {
      return <Laptop variant="home">{renderHub()}</Laptop>;
    }

    const AppComponent = activeApp.component;

    if (!AppComponent) {
      return (
        <Laptop variant={activeApp.laptopVariant ?? "empty"}>
          <div className="course-player__missing-app">
            <h1>{activeApp.label}</h1>
            <p>הקומפוננטה עדיין לא חוברה.</p>
            <button type="button" onClick={goHome}>
              חזרה למחשב
            </button>
          </div>
        </Laptop>
      );
    }

    const appProps = {
      page: progress.appPages[activeApp.id] ?? 0,
      onPageChange: (newPage) => setAppPage(activeApp.id, newPage),
      onBack: () => goToPreviousApp(activeApp.id),
      onHome: goHome,
      onComplete: () => finishApp(activeApp.id, "home"),
      onNext: () => finishApp(activeApp.id, "next"),
    };

    if (activeApp.showDesktopBehind) {
      return (
        <Laptop variant={activeApp.laptopVariant ?? "home"}>
          {renderHub({ blockApps: true })}
          <AppComponent {...appProps} />
        </Laptop>
      );
    }

    return (
      <Laptop variant={activeApp.laptopVariant ?? "empty"}>
        <AppComponent {...appProps} />
      </Laptop>
    );
  }

  return (
    <div className="course-player">
      <img
        src={backgroundDecor}
        className="background-decoration"
        alt=""
        draggable="false"
      />
      <img src={desk} className="desk" alt="" draggable="false" />
      <img src={plant} className="plant" alt="" draggable="false" />

      <div className="course-player__stage">
        {renderScreen()}

        <div className="course-player__navbar">
          <Navbar
            title={navbarTitle}
            items={navbarItems}
            onSelect={openApp}
            onExit={onExit}
          />
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;
