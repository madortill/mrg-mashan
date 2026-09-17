import React, {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { mountLaptop } from "./laptop-motion.js";
import "./LaptopOutro.css";

import base from "../../assets/images/laptop-base.svg";
import screen from "../../assets/images/laptop-screen.svg";
import back from "../../assets/images/laptop-back.svg";

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

  complete.current = onComplete;

  const width = framing === "original" ? 1524 : 1650;
  const height = framing === "original" ? 855 : 1045;

  // Sets the initial position before the browser paints.
  useLayoutEffect(() => {
    const instance = mountLaptop(root.current, {
      duration,
      initialClosed: opening,
      onComplete: () => complete.current?.(),
    });

    controller.current = instance;

    return () => {
      instance.destroy();
      controller.current = null;
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
            <img src={screen} alt="" draggable={false} />

            <div
              className="laptop-outro__content"
              aria-hidden={(!opening && closed) || undefined}
            >
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