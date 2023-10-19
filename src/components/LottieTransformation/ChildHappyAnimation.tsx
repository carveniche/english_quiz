import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import ChildHappyJson from "../../assets/LottieAnimation/Childhappy.json";
export default function ChildHappyAnimation() {
  const container = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const animationData = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: ChildHappyJson,
      });
      return () => {
        animationData.destroy();
      };
    }
  }, []);
  return (
    <div>
      <div className="sampleoneanimation" ref={container}></div>
    </div>
  );
}
