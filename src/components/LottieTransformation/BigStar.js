import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function BigStar() {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation(
      {
        container: container.current,
        renderer: "svg",
        loop: "true",
        autoplay: "true",
        animationData: require("../../assets/LottieAnimation/BigStar.json"),
      },
      []
    );
  });
  return (
    <div>
      <div className="sampleoneanimation" ref={container}></div>
    </div>
  );
}
