import { useEffect, useState } from "react";
import "./MobileLomdaOverlay.css";
import characterImage from "../../assets/images/gili.svg"
function MobileLomdaOverlay({
  breakpoint = 768,
  title = "הלומדה אינה מותאמת לטלפון",
  message = " :) לצפייה מיטבית בתוכן, מומלץ לפתוח את הלומדה ממחשב.",
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  if (!isMobile) return null;

  return (
    <div className="lomda-mobile-overlay">
      <div className="lomda-mobile-card">
        <div className="lomda-mobile-content">
          <div className="lomda-text-bubble">
            <h1 className="lomda-title">{title}</h1>
            <p className="lomda-message">{message}</p>
          </div>

          {characterImage && (
            <img
              src={characterImage}
              alt="דמות לומדה"
              className="lomda-character"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileLomdaOverlay;
