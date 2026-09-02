import { useState } from "react";
import ynet from "../../../assets/images/ynet.png";
import "./GoogleYnet.css"
const ArrowNext = ({ rotated }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
      className={`arrow-next ${rotated ? "rotated" : ""}`}
    >
      <path
        d="M6.91406 0.707031L1.41406 6.20703L6.91406 11.707"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

const Google = ({ onComplete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (expanded) {
      onComplete(); // לחיצה שנייה
    } else {
      setExpanded(true); // לחיצה ראשונה
    }
  };

  return (
    <>
    <div className="ynet-div">
<div className="ynet-header">
  <div className="ynet-header-inner">
      <img className="ynet_img" src={ynet} />
    <div className="ynet-logo">ynet</div>

    <div className="ynet-menu">
      <span>חדשות</span>
      <span>סדיר</span>
      <span>מילואים</span>
      <span>נפגעים</span>
      <span>תש</span>
      <span>מקמשר</span>
    </div>
  </div>
</div>

 
      <p className="main-title-ynet">מהו מרכז גיוס?</p>
      <p className="writer-ynet">מאת מרכז משאן</p>

      <p className="text-ynet">
        מפקדה סדירה הכפופה לאגף משא"ן בפיקוד הממונה על הקמתה, החזקתה
        והפעלתה של מערכת הגיוס בשגרה ובשעת חירום והורדת הפקודה אל האוגדות
        וגורמי משא"ן המילואים שתחתיה.
      </p>

      <p className="writer-ynet semi">קצינת משאן</p>

      <button type="button" className="ynet__cta" onClick={handleClick}>
        <span>{expanded ? "הבנתי הבא " : "להמשך הכתבה"}</span>
        <ArrowNext rotated={expanded} />
      </button>

      <p className={`second-ynet-text-before ${expanded ? "expanded" : ""}`}>
        בחירום מרכז הגיוס הופך למרכז שליטה ובקרה ואחראי לביצוע גיוס החל
        מתהליך הוצאת החייגן ועד סיום הגיוס. בנוסף, מרכז הגיוס מפיץ דוחות
        חריגים במהלך גיוס ומבצע מעקב על עמידה בתקני אמ"צ לכל יחידה.
      </p>
    </div>
    </>
  );
};

export default Google;
