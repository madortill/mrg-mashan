import { useNavigate } from "react-router-dom";
import ropeSticker from "../../assets/images/ropeSticker.svg";
import Bhd11End from "../../assets/images/giliSticker.svg";
import closeLaptop from "../../assets/images/closeLaptop.svg";
import logoWatermark from "../../assets/images/BHD11END.svg";

import "./End.css";

const End = () => {
    const navigate = useNavigate();

    return (
        <div className="end">
            <div className="end__frame">
                <img
                    src={closeLaptop}
                    className="end__laptop-img"
                    alt=""
                    draggable="false"
                />

                <div className="end__content">
                    <img
                        src={logoWatermark}
                        className="end__watermark"
                        alt=""
                        aria-hidden="true"
                    />

                    <img
                        src={ropeSticker}
                        className="end__rope-sticker"
                        alt=""
                    />

                    <img
                        src={Bhd11End}
                        className="end__gili-sticker"
                        alt=""
                    />

                    <div className="end__bottom">
                        <p className="end__title">
                            סיימתם את הלומדה בהצלחה!
                        </p>

                        <div className="end__actions">
                            <button
                                type="button"
                                className="end__btn"
                                onClick={() => navigate("/learning")}
                            >
                                &lt; חזור לתרגול
                            </button>
                            <button
                                type="button"
                                className="end__btn"
                                onClick={() => navigate("/")}
                            >
                                לתחילת הלומדה &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default End;