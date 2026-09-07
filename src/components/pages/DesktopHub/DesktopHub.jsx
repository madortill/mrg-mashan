import React from "react";

import "./DesktopHub.css";
import "./DesktopHub.responsive.css";

import rope from "../../../assets/images/rope2.svg";

function DesktopHub({
  apps = [],
  currentAppId,
  completedApps = [],
  visitedApps = [],
  introCompleted = false,
  isInteractionBlocked = false,
  onRopeClick,
  onOpenApp,
}) {
  const shouldRopeGlow =
    !introCompleted &&
    !isInteractionBlocked;

  return (
    <div
      className={[
        "desktop-hub",
        isInteractionBlocked ? "desktop-hub--blocked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={[
          "desktop-hub__rope-button",
          shouldRopeGlow
            ? "desktop-hub__rope-button--glowing"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onRopeClick}
        disabled={isInteractionBlocked}
        aria-label="פתיחת המבוא ללומדה"
      >
        <img
          src={rope}
          className="desktop-hub__rope"
          alt=""
          draggable="false"
        />
      </button>

      {apps.map((app) => {
        if (app.showOnDesktop === false || !app.position) {
          return null;
        }

        const isCurrent = app.id === currentAppId;
        const isCompleted = completedApps.includes(app.id);
        const isVisited = visitedApps.includes(app.id);

        const isAvailable =
          introCompleted &&
          (isCurrent || isCompleted || isVisited);

        return (
          <button
            key={app.id}
            type="button"
            className={[
              "desktop-app-hotspot",
              isCurrent ? "desktop-app-hotspot--current" : "",
              !isAvailable ? "desktop-app-hotspot--locked" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ ...app.position }}
            disabled={!isAvailable || isInteractionBlocked}
            onClick={() => onOpenApp?.(app.id)}
            aria-label={app.label}
            aria-current={isCurrent ? "step" : undefined}
          >
            {app.icon && (
              <img
                src={app.icon}
                className="desktop-app-hotspot__icon"
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