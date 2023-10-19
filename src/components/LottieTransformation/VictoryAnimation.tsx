import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../../assets/LottieAnimation/VictoryAnimation.json";

export default function VictoryAnimation() {
  const container = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const animationData2 = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: animationData,
      });
      return () => {
        animationData2.destroy();
      };
    }
  }, []);
  return (
    <div>
      <div className="sampleoneanimation" ref={container}></div>
    </div>
  );
}
