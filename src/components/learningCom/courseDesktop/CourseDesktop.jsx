import React, {
  useState,
} from "react";

import "./CourseDesktop.css";

import desktopComputer from "../../../assets/images/computer_desktop.png";

import ResponsiveLaptop from "./ResponsiveLaptop";

// CourseDesktop.jsx
import LaptopDesktop from "../LaptopDesktop";
import DesktopApps from "../../../elements/desktopApps/DesktopApps";
import IntroPopup from "../../../elements/introPopUp/IntroPopup";
import {
  useCourseNavigation,
} from "../../../course/CourseNavigationContext";

const POPUP_STORAGE_KEY =
  "course-desktop-popup-seen";

function CourseDesktop() {
  const {
    activeTopicId,
    isTopicUnlocked,
    isTopicComplete,
    openTopic,
  } = useCourseNavigation();

  const [popupIsOpen, setPopupIsOpen] =
    useState(() => {
      return (
        window.sessionStorage.getItem(
          POPUP_STORAGE_KEY
        ) !== "true"
      );
    });

  function closePopup() {
    window.sessionStorage.setItem(
      POPUP_STORAGE_KEY,
      "true"
    );

    setPopupIsOpen(false);
  }

  return (
    <section className="course-desktop">
      <ResponsiveLaptop
        image={desktopComputer}
        alt="מחשב עם יישומי הלומדה"

        /*
          אלו הערכים שמתאימים את
          התוכן למסך של התמונה החדשה.
        */
        screenTop="4.4%"
        screenLeft="13.9%"
        screenWidth="72.2%"
        screenHeight="73.8%"
      >
        <div className="course-desktop__screen">
          <DesktopApps
            apps={DESKTOP_APPS}
            activeTopicId={
              activeTopicId
            }
            isTopicUnlocked={
              isTopicUnlocked
            }
            isTopicComplete={
              isTopicComplete
            }
            onOpenTopic={openTopic}
          />

          <IntroPopup
            open={popupIsOpen}
            onClose={closePopup}
          />
        </div>
      </ResponsiveLaptop>
    </section>
  );
}

export default CourseDesktop;