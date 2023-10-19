import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import animationData from "../LottieAnimations/Sademotion.json"; //assets/LottieAnimation/Sademotion.json
import styles from "./LottieMathZone.module.css";
export default function GameLoseEmotionMathZone() {
  const container = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const animationData2 = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: "false",
      autoplay: "false",
      animationData: animationData,
    });
    return () => {
      animationData2.destroy();
    };
  }, []);
  return (
    <div key={1}>
      {
        <div
          className={`sampleoneanimation ${styles.gameLoseAnimation}`}
          ref={container}
        ></div>
      }
    </div>
  );
}
