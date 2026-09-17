import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { mountLaptop } from "./laptop-motion.js";
import "./LaptopOutro.css";

import base from "../../assets/images/laptop-base.svg";
import screen from "../../assets/images/laptop-screen.svg";
import screenBlack from "../../assets/images/laptop-screen-black.svg";
import back from "../../assets/images/laptop-back-flat.svg";

export default function LaptopOutro({
  closed = false,
  opening = false,
  duration = 4200,
  onComplete,
  framing = "full",
  children,
  lidLogoSrc,
  className = "",
  style,
  label = "מחשב נייד",
}) {
  const root = useRef(null);
  const controller = useRef(null);
  const complete = useRef(onComplete);
  const bootTimerRef = useRef(null); // ⭐ כאן, לא בהמשך הקובץ

  complete.current = onComplete;

  const [bootPhase, setBootPhase] = useState(
    opening ? "booting" : "ready"
  );

  // ... כל שאר הקוד נשאר זהה, פשוט תמחק את השורה
  // "const bootTimerRef = useRef(null);" שהופיעה בהמשך

  const width = framing === "original" ? 1524 : 1650;
  const height = framing === "original" ? 855 : 1045;

  useLayoutEffect(() => {
    const instance = mountLaptop(root.current, {
      duration,
      initialClosed: opening,
      onComplete: () => {
        // בפתיחה בלבד: המכסה נפתח -> מסך שחור עם לואדר
        // למשך 2 שניות נוספות -> ואז עוברים למסך הרגיל
        // ורק אז מודיעים להורה שהאנימציה הושלמה.
        if (opening) {
          const timer = setTimeout(() => {
            setBootPhase("ready");
            complete.current?.();
          }, 500);

          bootTimerRef.current = timer;
        } else {
          complete.current?.();
        }
      },
    });

    controller.current = instance;

    return () => {
      instance.destroy();
      controller.current = null;

      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current);
      }
    };
  }, [duration, framing, opening]);


  useEffect(() => {
    const content = root.current.querySelector(
      ".laptop-outro__content"
    );

    content.inert = !opening && closed;

    controller.current?.setClosed(
      opening ? false : closed,
      { animate: opening || closed }
    );
  }, [closed, duration, framing, opening]);

  const isBooting = opening && bootPhase !== "ready";
  const screenSrc = isBooting ? screenBlack : screen;

  return (
    <div
      ref={root}
      className={`laptop-outro ${className}`}
      data-view-width={width}
      role={children == null ? "img" : "group"}
      aria-label={label}
      style={{
        ...style,
        "--laptop-view-width": width,
        "--laptop-view-height": height,
      }}
    >
      <div className="laptop-outro__scene" data-scene>
        <img
          className="laptop-outro__base"
          src={base}
          alt=""
          draggable={false}
        />

        <div className="laptop-outro__lid" data-lid>
          <div className="laptop-outro__front" data-front>
            <img src={screenSrc} alt="" draggable={false} />

            <div
              className="laptop-outro__content"
              aria-hidden={(!opening && closed) || undefined}
            >
              {isBooting && (
                <div
                  className="laptop-outro__boot-loader"
                  aria-hidden="true"
                >
                  <span className="laptop-outro__boot-spinner" />
                </div>
              )}

              {children}
            </div>
          </div>

          <div className="laptop-outro__back" data-back>
            <img
              className="laptop-outro__back-image"
              src={back}
              alt=""
              draggable={false}
            />

            {lidLogoSrc && (
              <img
                className="laptop-outro__lid-logo"
                src={lidLogoSrc}
                alt=""
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}