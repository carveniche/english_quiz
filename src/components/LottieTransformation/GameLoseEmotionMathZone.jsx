import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../LottieAnimations/Sademotion.json"; //assets/LottieAnimation/Sademotion.json
import styles from "./LottieMathZone.module.css";
export default function GameLoseEmotionMathZone() {
  const container = useRef(null);

  useEffect(() => {
    // lottie.loadAnimation({
    //   container: container.current,
    //   renderer: "svg",
    //   loop: "false",
    //   autoplay: "false",
    //   animationData: animationData,
    // });
  }, []);
  return (
    <div>
      <div
        className={`sampleoneanimation ${styles.gameLoseAnimation}`}
        ref={container}
      ></div>
    </div>
  );
}
