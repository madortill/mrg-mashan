import "./SpeechBubble.css";
import gili from "../../../assets/images/gili.svg";

const SpeechBubble = ({ speechText }) => (
 <div className="character-bubble">
    {speechText && (
      <div className="character-bubble__speech">
        <p>{speechText}</p>
      </div>
    )}
    <img src={gili} className="character-bubble__gili" alt="Gili" />
  </div>
);

export default SpeechBubble;