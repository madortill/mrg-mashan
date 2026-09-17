import ropeSticker from "../../assets/images/ropeSticker.svg";
import Bhd11End from "../../assets/images/giliSticker.svg";
import closeLaptop from "../../assets/images/closeLaptop.svg";
import logoWatermark from "../../assets/images/BHD11END.svg";
import confeti from "../../assets/images/Confetti.svg";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LaptopOutro from "./LaptopOutro";
import desk from "../../assets/images/desk_wide.svg";
import plant from "../../assets/images/plant.svg";
import backgroundDecor from "../../assets/images/background-decor.svg";
import "./End.css";

export default function End() {
      const navigate = useNavigate();
  const [finished, setFinished] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (finished) {
      titleRef.current?.focus({ preventScroll: true });
    }
  }, [finished]);

  return (
    <main className="course-end" dir="rtl">
            <img src={backgroundDecor} className="background-decoration" alt="" draggable="false" />
            <img src={desk} className="desk" alt="" draggable="false" />
            <img src={plant} className="plant" alt="" draggable="false" />
   

      <div className="course-end__desk" aria-hidden="true" />

      {/* אותו לפטופ נשאר על המסך גם אחרי הסגירה */}
      <div className="course-end__laptop" aria-hidden="true">
        <LaptopOutro
            closed={true}
            duration={4200}
            framing="full"
            lidLogoSrc={logoWatermark}
            onComplete={() => setFinished(true)}
            />
      </div>

      {/* מופיע רק כשסגירת הלפטופ הסתיימה */}
      {finished && (
        <section
          className="course-end__message"
          aria-labelledby="end-title"
        >
                <img
        className="course-end__confetti"
        src={confeti}
        alt=""
        />

          <h1 id="end-title" ref={titleRef} tabIndex={-1}>
            כל הכבוד!
          </h1>

          <p>סיימתם את הלומדה בהצלחה</p>

          <button
            type="button"
            className="course-end__button"
            onClick={() => navigate("/")}
          >
            <span>לתחילת הלומדה</span>
            <span aria-hidden="true">›</span>
          </button>
        </section>
      )}
    </main>
  );
}