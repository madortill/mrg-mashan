import React from "react";

import "./DesktopHub.css";

import desktopBackground from "./../../../assets/images/home-desktop.svg";

import { courseApps } from "../../course/CourseApp";
import desk from "../../../assets/images/desk_wide.svg";
import plant from "../../../assets/images/plant.svg";
import backgroundDecor from "../../../assets/images/background-decor.svg";

function DesktopHub({
  currentAppId,
  completedApps,
  visitedApps,
  onOpenApp,
}) {
  return (
    <main className="desktop-hub">
 

      {/* כל הגרפיקה של המסך */}
      <img
        src={desktopBackground}
        alt=""
        className="desktop-hub__background"
        draggable="false"
      />

      {/* האזור של מסך המחשב */}
      <div className="desktop-hub__screen">

        {courseApps.map((app) => {
          const isCurrent =
            app.id === currentAppId;

          const isCompleted =
            completedApps.includes(app.id);

          const isVisited =
            visitedApps.includes(app.id);

          const isAvailable =
            isCurrent ||
            isCompleted ||
            isVisited;

          return (
            <button
              key={app.id}
              type="button"
              className={[
                "desktop-app",

                isCurrent
                  ? "desktop-app--current"
                  : "",

                isCompleted
                  ? "desktop-app--completed"
                  : "",

                !isAvailable
                  ? "desktop-app--locked"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                top: app.position.top,
                right: app.position.right,
              }}
              disabled={!isAvailable}
              onClick={() =>
                onOpenApp(app.id)
              }
            >
              <img
                src={app.icon}
                alt=""
                className="desktop-app__icon"
                draggable="false"
              />

              <span className="desktop-app__label">
                {app.label}
              </span>
            </button>
          );
        })}

      </div>
    </main>
  );
}

export default DesktopHub;