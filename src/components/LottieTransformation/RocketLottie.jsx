import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function RocketLottie() {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation(
      {
        container: container.current,
        renderer: "svg",
        loop: "false",
        autoplay: "false",
        animationData: require("../../assets/LottieAnimation/rocket.json"),
      },
      []
    );
  });
  return (
   
      <div className="sampleoneanimation4" ref={container}
      
      >
    </div>
  );
}
