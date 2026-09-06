import chromeIcon from "./../../assets/images/apps/google.png";
import excelIcon from "./../../assets/images/apps/exel.png";
import outlookIcon from "./../../assets/images/apps/outlook.png";
import padletIcon from "./../../assets/images/apps/padlet.png";
import chatgpt from "./../../assets/images/apps/chatgpt.png";
import targetIcon from "./../../assets/images/apps/target.png";

export const courseApps = [
 
  {
        id: "target",
    label: "Target",
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
    id: "padlet",
    label: "Padlet",
    icon: padletIcon,
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
    id: "excel",
    label: "Excel",
    icon: targetIcon,
    position: {
      top: "52%",
      right: "12.5%",
    },
  },
  {
    id: "chatgpt",
    label: "צאט",
    icon: chatgpt,
    position: {
      top: "52%",
      right: "1.5%",
    },
  },
];