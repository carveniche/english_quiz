import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../LottieAnimations/correctAnswerLottie.json";
import styles from "./LottieMathZone.module.css";
import { cloneDeep } from "lodash";
const removeWhiteSpace = (container) => {
  let rects = container.current?.querySelector("rect");
};
export default function CorrectAnswerAnimation() {
  const container = useRef(null);

  useEffect(() => {
    // lottie.loadAnimation({
    //   container: container.current,
    //   renderer: "svg",
    //   loop: "false",
    //   autoplay: "false",
    //   animationData: cloneDeep(animationData),
    // });
    // removeWhiteSpace(container);
  }, []);
  return (
    <div>
      <div
        className={`sampleoneanimation ${styles.correctAnswerAnimation}`}
        ref={container}
      ></div>
    </div>
  );
}
