import React from "react";

import "./DesktopHub.css";

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
    !introCompleted && !isInteractionBlocked;

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
        const isSettings = app.id === "setting";

        const isAvailable =
          introCompleted &&
          (isCurrent || isCompleted || isVisited);

        const shouldAppGlow =
          isCurrent && isAvailable && !isInteractionBlocked;

        return (
          <button
            key={app.id}
            type="button"
            className={[
              "desktop-app-hotspot",
              isCurrent ? "desktop-app-hotspot--current" : "",
              isVisited ? "desktop-app-hotspot--visited" : "",
              isCompleted ? "desktop-app-hotspot--completed" : "",
              isSettings ? "desktop-app-hotspot--settings" : "",
              !isAvailable ? "desktop-app-hotspot--locked" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              ...app.position,
              ...(isSettings
                ? {
                    top: "auto",
                    left: "auto",
                    right: "3.5%",
                    bottom: "6%",
                  }
                : {}),
              "--app-glow": app.glow,
              "--app-glow-2": app.glow2,
            }}
            disabled={!isAvailable || isInteractionBlocked}
            onClick={() => onOpenApp?.(app.id)}
            aria-label={
              isCompleted
                ? `${app.label} — הושלם`
                : isVisited
                  ? `${app.label} — ביקרת כאן`
                  : app.label
            }
            aria-current={isCurrent ? "step" : undefined}
          >
            {app.icon && (
              <img
                src={app.icon}
                className={[
                  "desktop-app-hotspot__icon",
                  shouldAppGlow
                    ? "desktop-app-hotspot__icon--glowing"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                alt=""
                draggable="false"
              />
            )}

            <span className="desktop-app-hotspot__label">
              {app.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DesktopHub;