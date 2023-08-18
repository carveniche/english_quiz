import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import cloneDeep from "lodash.clonedeep";
import animationData from "../../assets/LottieAnimation/Sademotion.json";
import styles from "./LottieMathZone.module.css"
export default function GameLooseEmotion() {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: "false",
      autoplay: "false",
      animationData: cloneDeep(animationData),
    });
  }, []);
  return (
    <div>
      <div className={`sampleoneanimation ${styles.gameLoseAnimation}`} ref={container}></div>
    </div>
  );
}
