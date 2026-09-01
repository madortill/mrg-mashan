import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./CoursePlayer.css";

import rope
  from "./../../assets/images/color_rope.svg";
import Navbar
  from "../elements/navbar/Navbar";

import Target from "./../apps/target/Target.jsx";
import IntroPopUp from "./../elements/introPopUp/IntroPopUp.jsx";
import desk from "../../assets/images/desk_wide.svg";
import plant from "../../assets/images/plant.svg";
import backgroundDecor from "../../assets/images/background-decor.svg";
import DesktopHub
  from "./../pages/DesktopHub/DesktopHub";

  import Laptop
  from "./../elements/laptop/Laptop";

/* =========================================
   שמירה
========================================= */

const STORAGE_KEY =
  "mrg-mashan:course-progress:v1";


/* =========================================
   כותרת של ה-HUB

   כאן את שמה בעצמך את הכותרת
   שאת רוצה לראות ב-navbar
========================================= */
const HUB_NAVBAR_TITLE =
  "לחצו על האפליקציה הזוהרת";
/* =========================================
   סדר האפליקציות בלומדה

   אפשר לשנות כאן את הסדר
   בלי לשנות את שאר הקוד.
========================================= */

const COURSE_APPS = [
  {
    id: "popUp",
    label: "start Popup",
    navbarTitle: "מבוא ללומדה",
    component: IntroPopUp,
    laptopVariant: "home",
    showDesktopBehind: true,
  },
  {
    id: "target",
    label: "Target",
    navbarTitle: "מטרות הלומדה",
    component: Target,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
  {
    id: "chrome",
    label: "Google Chrome",
    navbarTitle: "מהו מרכז גיוס? google",
    component: null,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
  {
    id: "excel",
    label: "Excel",
    navbarTitle: "כאן תכתבי את הכותרת של Excel",
    component: null,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
  {
    id: "yanshuf",
    label: "ינשוף",
    navbarTitle: "כאן תכתבי את הכותרת של ינשוף",
    component: null,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
  {
    id: "outlook",
    label: "Outlook",
    navbarTitle: "כאן תכתבי את הכותרת של Outlook",
    component: null,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
  {
    id: "people",
    label: "אנשים",
    navbarTitle: "כאן תכתבי את הכותרת של אנשים",
    component: null,
    laptopVariant: "empty",
    showDesktopBehind: false,
  },
];

/* =========================================
   עמוד פנימי התחלתי לכל אפליקציה
========================================= */

const initialAppPages = {
  target: 0,
  excel: 0,
  chrome: 0,
  yanshuf: 0,
  outlook: 0,
  people: 0,
};


/* =========================================
   מצב חדש לחלוטין
========================================= */

const defaultProgress = {

  screen: "hub",
  /*
    האינדקס הכי רחוק
    שהמשתמש פתח.

    0 = Target
  */
  highestUnlockedIndex: 0,

introPopupSeen: false,
  /*
    אפליקציות שנכנסנו אליהן
  */
  visitedApps: [],


  /*
    אפליקציות שסיימנו
  */
  completedApps: [],


  /*
    באיזה עמוד פנימי
    היינו בכל אפליקציה
  */
  appPages:
    initialAppPages,
};


/* =========================================
   טעינה מ-sessionStorage
========================================= */

function getInitialProgress() {

  try {

    const saved =
      sessionStorage.getItem(
        STORAGE_KEY
      );


    if (!saved) {
      return defaultProgress;
    }


    const parsed =
      JSON.parse(saved);


    return {

      ...defaultProgress,

      ...parsed,


      visitedApps:
        Array.isArray(
          parsed.visitedApps
        )
          ? parsed.visitedApps
          : [],


      completedApps:
        Array.isArray(
          parsed.completedApps
        )
          ? parsed.completedApps
          : [],


      appPages: {
        ...initialAppPages,
        ...(parsed.appPages || {}),
      },
    };

  } catch (error) {

    console.error(
      "Could not load course progress:",
      error
    );

    return defaultProgress;
  }
}


/* =========================================
   COURSE PLAYER
========================================= */

function CoursePlayer({
  onExit,
}) {

  const [
    progress,
    setProgress,
  ] = useState(
    getInitialProgress
  );

  function closeIntroPopup() {
  setProgress((previous) => ({
    ...previous,
    introPopupSeen: true,
  }));
  onComplete();
}

  /* =======================================
     שמירה אוטומטית
  ======================================= */

  useEffect(() => {

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );

  }, [progress]);


  /* =======================================
     האפליקציה החדשה
     שהמשתמש צריך לעשות עכשיו
  ======================================= */

  const highlightedAppId =
    useMemo(() => {

      const app =
        COURSE_APPS[
          progress
            .highestUnlockedIndex
        ];


      return app?.id ?? null;

    }, [
      progress
        .highestUnlockedIndex,
    ]);


  /* =======================================
     האם מותר לפתוח אפליקציה?
  ======================================= */

  function canOpenApp(
    appId
  ) {

    const index =
      COURSE_APPS.findIndex(
        (app) =>
          app.id === appId
      );


    if (index === -1) {
      return false;
    }


    return (
      index <=
        progress
          .highestUnlockedIndex ||

      progress
        .visitedApps
        .includes(appId) ||

      progress
        .completedApps
        .includes(appId)
    );
  }


  /* =======================================
     פתיחת אפליקציה
  ======================================= */

  function openApp(
    appId
  ) {

    if (
      !canOpenApp(appId)
    ) {
      return;
    }


    setProgress(
      (previous) => ({

        ...previous,

        screen:
          appId,


        visitedApps:
          Array.from(
            new Set([
              ...previous
                .visitedApps,

              appId,
            ])
          ),
      })
    );
  }


  /* =======================================
     חזרה למסך הראשי
  ======================================= */

  function goHome() {

    setProgress(
      (previous) => ({

        ...previous,

        screen: "hub",
      })
    );
  }


  /* =======================================
     שינוי עמוד בתוך אפליקציה
  ======================================= */

  function setAppPage(
    appId,
    page
  ) {

    setProgress(
      (previous) => ({

        ...previous,

        appPages: {

          ...previous.appPages,

          [appId]: page,
        },
      })
    );
  }


  /* =======================================
     סימון אפליקציה כגמורה
  ======================================= */

  function finishApp(
    appId,
    destination = "home"
  ) {

    const appIndex =
      COURSE_APPS.findIndex(
        (app) =>
          app.id === appId
      );


    if (appIndex === -1) {
      return;
    }


    const nextIndex =
      appIndex + 1;


    const nextApp =
      COURSE_APPS[
        nextIndex
      ];


    setProgress(
      (previous) => {

        const newCompleted =
          Array.from(
            new Set([
              ...previous
                .completedApps,

              appId,
            ])
          );


        /*
          חשוב מאוד:

          Math.max גורם לכך שאם
          חזרנו אחורה, ההתקדמות
          הכי רחוקה לעולם לא נמחקת.
        */

        const newHighest =
          Math.max(
            previous
              .highestUnlockedIndex,

            Math.min(
              nextIndex,
              COURSE_APPS.length
            )
          );
        /*
          חזרה ל-HUB
        */
        if (
          destination ===
          "home"
        ) {
          return {

            ...previous,

            screen:
              "hub",

            completedApps:
              newCompleted,

            highestUnlockedIndex:
              newHighest,
          };
        }
        /*
          מעבר ישיר
          לאפליקציה הבאה
        */
        if (
          destination ===
            "next" &&
          nextApp
        ) {
          return {

            ...previous,

            screen:
              nextApp.id,

            completedApps:
              newCompleted,

            highestUnlockedIndex:
              newHighest,

            visitedApps:
              Array.from(
                new Set([
                  ...previous
                    .visitedApps,

                  nextApp.id,
                ])
              ),
          };
        }
        /*
          סיימנו את
          האפליקציה האחרונה
        */
        return {

          ...previous,

          screen:
            "hub",

          completedApps:
            newCompleted,

          highestUnlockedIndex:
            newHighest,
        };
      }
    );
  }

  /* =======================================
     חזרה לאפליקציה הקודמת
  ======================================= */
  function goToPreviousApp(
    appId
  ) {
    const index =
      COURSE_APPS.findIndex(
        (app) =>
          app.id === appId
      );

    /*
      אם זאת האפליקציה הראשונה,
      חוזרים למחשב
    */

    if (index <= 0) {
      goHome();
      return;
    }

    const previousApp =
      COURSE_APPS[
        index - 1
      ];
    openApp(
      previousApp.id
    );
  }


  /* =======================================
     CONFIG של המסך הפתוח
  ======================================= */

  const activeApp =
    COURSE_APPS.find(
      (app) =>
        app.id ===
        progress.screen
    );


  /* =======================================
     כותרת NAVBAR

     אלו המקומות היחידים
     שאת צריכה לשנות בהם כותרות.
  ======================================= */

  const navbarTitle =
    progress.screen === "hub"

      ? HUB_NAVBAR_TITLE

      : (
          activeApp
            ?.navbarTitle ??
          ""
        );


  /* =======================================
     ITEMS של NAVBAR
  ======================================= */

  const navbarItems =
    COURSE_APPS.map(
      (app, index) => {

        const isCurrent =
          progress.screen ===
          app.id;


        const isCompleted =
          progress
            .completedApps
            .includes(
              app.id
            );


        const isVisited =
          progress
            .visitedApps
            .includes(
              app.id
            );


        const isUnlocked =
          index <=
            progress
              .highestUnlockedIndex ||
          isVisited ||
          isCompleted;


        let status =
          "locked";


        if (isCurrent) {

          status =
            "current";

        } else if (
          isCompleted
        ) {

          status =
            "completed";

        } else if (
          isUnlocked
        ) {

          status =
            "next";
        }


        return {

          id:
            app.id,

          label:
            app.label,

          status,

          disabled:
            !isUnlocked,
        };
      }
    );


 /* =======================================
   RENDER של המסך
======================================= */

function renderScreen() {

  /* ==============================
     HOME / DESKTOP
  ============================== */

  if (progress.screen === "hub") {
    return (
      <Laptop variant="home">

      <>
      <DesktopHub
        currentAppId={highlightedAppId}
        completedApps={progress.completedApps}
        visitedApps={progress.visitedApps}
        onOpenApp={openApp}
      />

      <IntroPopUp
        open={!progress.introPopupSeen}
       onClose={closeIntroPopup}
      />
   </>

      </Laptop>
    );
  }


  /* ==============================
     APP לא קיימת
  ============================== */

  if (!activeApp) {
    return (
      <Laptop variant="home">

        <DesktopHub
          currentAppId={highlightedAppId}
          completedApps={
            progress.completedApps
          }
          visitedApps={
            progress.visitedApps
          }
          onOpenApp={openApp}
        />

      </Laptop>
    );
  }


  const AppComponent =
    activeApp.component;


  /* ==============================
     עוד לא חיברנו קומפוננטה
  ============================== */

  if (!AppComponent) {
    return (
      <Laptop
        variant={
          activeApp.laptopVariant ??
          "empty"
        }
      >

        <div className="course-player__missing-app">

          <h1>
            {activeApp.label}
          </h1>

          <p>
            הקומפוננטה עדיין לא חוברה.
          </p>

          <button
            type="button"
            onClick={goHome}
          >
            חזרה למחשב
          </button>

        </div>

      </Laptop>
    );
  }


  /* ==============================
     PROPS משותפים לכל אפליקציה
  ============================== */

  const appProps = {

    page:
      progress.appPages[
        activeApp.id
      ] ?? 0,


    onPageChange: (
      newPage
    ) =>
      setAppPage(
        activeApp.id,
        newPage
      ),


    onBack: () =>
      goToPreviousApp(
        activeApp.id
      ),


    onHome:
      goHome,


    onComplete: () =>
      finishApp(
        activeApp.id,
        "home"
      ),


    onNext: () =>
      finishApp(
        activeApp.id,
        "next"
      ),
  };


  /* ==============================
     INTRO / קומפוננטה שיושבת
     מעל שולחן העבודה
  ============================== */

  if (
    activeApp.showDesktopBehind
  ) {
    return (
      <Laptop
        variant={
          activeApp.laptopVariant ??
          "home"
        }
      >

        <DesktopHub
          currentAppId={null}
          completedApps={
            progress.completedApps
          }
          visitedApps={
            progress.visitedApps
          }

          /*
            בזמן הפופאפ לא מאפשרים
            ללחוץ על אפליקציות
          */
          onOpenApp={() => {}}
        />


        <AppComponent
          {...appProps}
        />

      </Laptop>
    );
  }


  /* ==============================
     APP רגילה
     Target / Excel / וכו'
  ============================== */

  return (
    <Laptop
      variant={
        activeApp.laptopVariant ??
        "empty"
      }
    >

      <AppComponent
        {...appProps}
      />

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

        <img
          src={desk}
          className="desk"
          alt=""
          draggable="false"
        />

        <img
          src={plant}
          className="plant"
          alt=""
          draggable="false"
        />
      <div className=
        "course-player__stage"
      >
        {/* <img
  src={rope}
  className="desktop-apps__rope"
  alt=""
  draggable="false"
/> */}

        {renderScreen()}


        <div className=
          "course-player__navbar"
        >

          <Navbar
            title={
              navbarTitle
            }

            items={
              navbarItems
            }

            onSelect={
              openApp
            }
          />

        </div>

      </div>
    </div>
  );
}


export default CoursePlayer;