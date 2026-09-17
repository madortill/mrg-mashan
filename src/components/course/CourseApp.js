import chromeIcon from "./../../assets/images/apps/google.png";
import excelIcon from "./../../assets/images/apps/exel.png";
import outlookIcon from "./../../assets/images/apps/outlook.png";
import padletIcon from "./../../assets/images/apps/padlet.png";
import chatgpt from "./../../assets/images/apps/chatgpt.png";
import settingIcon from "./../../assets/images/apps/setting.svg";
import targetIcon from "./../../assets/images/apps/target.png";
import duolingoIcon from "./../../assets/images/apps/duolingoIcon.svg";
import emptyDetailsIcon from "./../../assets/images/folder.svg";

export const courseApps = [
 
  {
        id: "target",
    label: "Target",
        icon: targetIcon,
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
      right: "3.5%",
    },
  },
  {
    id: "padlet",
    label: "Padlet",
    icon: padletIcon,
    position: {
      top: "24%",
      right: "12.5%",
    },
  },
  {
    id: "outlook",
    label: "Outlook",
    icon: outlookIcon,
    position: {
      top: "24%",
      right: "3.5%",
    },
  },
  {
    id: "excel",
    label: "Excel",
    icon: excelIcon,
    position: {
      top: "40%",
      right: "12.5%",
    },
  },
  {
    id: "game",
    label: "פרטים חסרים",
    icon: emptyDetailsIcon,
    position: {
            top: "40%",
      right: "3.5%",
    },
  },
  {
    id: "chatgpt",
    label: "צאט",
    icon: chatgpt,
    position: {
      top: "60%",
      right: "3.5%",
    },
  },
  {
    id: "setting",
    label: "הגדרות",
    icon: settingIcon,
    position: {
      top: "85%",
      right: "3.5%",
    },
  },
  {
    id: "duolingo",
    label: "דואלינג'",
    icon: duolingoIcon,
    position: {
      top: "60%",
      right: "12.5%",
    },
  },
  
];