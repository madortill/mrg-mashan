import React from "react";

import "./DesktopHub.css";

import {
  courseApps,
} from "../../course/CourseApp";


import rope
  from "../../../assets/images/color_rope.svg";


function DesktopHub({
  currentAppId,
  completedApps = [],
  visitedApps = [],
  onOpenApp,
}) {

  return (
    <div className="desktop-hub">


      {/* ==================================
          החבל הזוהר
      ================================== */}

      <img
        src={rope}
        className="desktop-hub__rope"
        alt=""
        draggable="false"
      />


      {/* ==================================
          האפליקציות

          האייקונים כבר נמצאים
          בתמונת home-desktop.

          לכן כאן אנחנו יוצרים
          אזורי לחיצה מעליהם.

          רק האפליקציה הנוכחית
          מקבלת SVG נוסף בשביל glow.
      ================================== */}

      {courseApps.map((app) => {

        /*
          intro לדוגמה הוא חלק מהניווט,
          אבל לא אפליקציה על שולחן העבודה
        */
        if (
          app.showOnDesktop === false
        ) {
          return null;
        }


        if (!app.position) {
          return null;
        }


        const isCurrent =
          app.id ===
          currentAppId;


        const isCompleted =
          completedApps.includes(
            app.id
          );


        const isVisited =
          visitedApps.includes(
            app.id
          );


        const isAvailable =
          isCurrent ||
          isCompleted ||
          isVisited;


        return (
          <button
            key={app.id}
            type="button"
            className={[
              "desktop-app-hotspot",

              isCurrent
                ? "desktop-app-hotspot--current"
                : "",

              !isAvailable
                ? "desktop-app-hotspot--locked"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              top:
                app.position.top,

              right:
                app.position.right,
            }}
            disabled={
              !isAvailable
            }
            onClick={() =>
              onOpenApp?.(
                app.id
              )
            }
            aria-label={
              app.label
            }
          >

            {/* רק האפליקציה הפעילה
                מצוירת שוב מעל המקור
                כדי שנוכל לתת לה glow */}

            {isCurrent &&
              app.icon && (

                <img
                  src={app.icon}
                  className="desktop-app-hotspot__active-icon"
                  alt=""
                  draggable="false"
                />

              )}

          </button>
        );
      })}

    </div>
  );
}


export default DesktopHub;