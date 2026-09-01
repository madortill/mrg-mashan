import chromeIcon from "./../../assets/images/apps/google.png";
import excelIcon from "./../../assets/images/apps/exel.png";
import rope from "./../../assets/images/rope.svg";
import outlookIcon from "./../../assets/images/apps/outlook.png";
import yanshufIcon from "./../../assets/images/apps/oul.png";
import peopleIcon from "./../../assets/images/apps/people.png";
import targetIcon from "./../../assets/images/apps/target.png";

export const courseApps = [
  {
    id: "popUp",
    label: "popup",
    icon: rope,
    position: {
      top: "1%",
      left: "2%",
    },
  },
  {
    id: "excel",
    label: "Excel",
    icon: excelIcon,
    position: {
      top: "6%",
      right: "12.5%",
    },
  },
  {
    id: "chrome",
    label: "Google chrome",
    icon: chromeIcon,
    position: {
      top: "6%",
      right: "1.5%",
    },
  },
  {
    id: "yanshuf",
    label: "ינשוף",
    icon: yanshufIcon,
    position: {
      top: "29%",
      right: "12.5%",
    },
  },
  {
    id: "outlook",
    label: "Outlook",
    icon: outlookIcon,
    position: {
      top: "29%",
      right: "1.5%",
    },
  },
  {
    id: "target",
    label: "Target",
    icon: targetIcon,
    position: {
      top: "52%",
      right: "12.5%",
    },
  },
  {
    id: "people",
    label: "אנשים",
    icon: peopleIcon,
    position: {
      top: "52%",
      right: "1.5%",
    },
  },
];