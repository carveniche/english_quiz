import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function SmileyLottie() {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation(
      {
        container: container.current,
        renderer: "svg",
        loop: "false",
        autoplay: "false",
        animationData: require("../../assets/LottieFiles/smiley.json"),
      },
      []
    );
  });
  return (
    <div>
      <div className="sampleoneanimation2" ref={container}></div>
    </div>
  );
}