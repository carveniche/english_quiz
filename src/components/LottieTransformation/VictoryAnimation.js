import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import cloneDeep from "lodash.clonedeep";
import animationData from "../../assets/LottieAnimation/VictoryAnimation.json";

export default function VictoryAnimation() {
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
      <div className="sampleoneanimation" ref={container}></div>
    </div>
  );
}
