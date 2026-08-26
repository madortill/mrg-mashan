import React from "react";

import laptopOpening from "../../assets/images/computer_home.png";

import DesktopApps from "../../components/DesktopApps/DesktopApps";
import { DESKTOP_APPS } from "../../course/desktopApps";

function LaptopDesktop({
  activeTopicId,
  isTopicUnlocked,
  isTopicComplete,
  onTopicClick,
}) {
  return (
    <div className="laptop-positioner">
      <div className="laptop-motion">
        <img
          src={laptopOpening}
          className="laptop-image"
          alt="מחשב עם יישומי הלומדה"
          draggable="false"
        />

        <div className="laptop-screen">
          <DesktopApps
            apps={DESKTOP_APPS}
            activeTopicId={activeTopicId}
            isTopicUnlocked={isTopicUnlocked}
            isTopicComplete={isTopicComplete}
            onOpenTopic={onTopicClick}
          />
        </div>
      </div>
    </div>
  );
}

export default LaptopDesktop;