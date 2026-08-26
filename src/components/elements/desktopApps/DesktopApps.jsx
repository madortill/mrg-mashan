import React from "react";

import "./DesktopApps.css";


function DesktopApps({
  apps,
  activeTopicId,
  isTopicUnlocked,
  isTopicComplete,
  onOpenTopic,
}) {
  return (
    <div className="desktop-apps">
      {apps.map((app) => {
        const isUnlocked =
          isTopicUnlocked(app.topicId);

        const isComplete =
          isTopicComplete(app.topicId);

        const isActive =
          app.topicId === activeTopicId;

        const classes = [
          "desktop-app",

          isActive
            ? "desktop-app--active"
            : "",

          isComplete
            ? "desktop-app--complete"
            : "",

          !isUnlocked
            ? "desktop-app--locked"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={app.topicId}
            type="button"
            className={classes}
            disabled={!isUnlocked}
            onClick={() =>
              onOpenTopic(app.topicId)
            }
          >
            <span
              className="desktop-app__glow"
              aria-hidden="true"
            />

            <span className="desktop-app__icon-wrapper">
              <img
                src={app.icon}
                className="desktop-app__icon"
                alt=""
                draggable="false"
              />

              {isComplete && (
                <span
                  className="desktop-app__complete-badge"
                  aria-label="הושלם"
                >
                  ✓
                </span>
              )}
            </span>

            <span className="desktop-app__label">
              {app.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DesktopApps;