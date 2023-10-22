import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

import fiveStarLottie from "../../assets/LottieFiles/FiveStar.json";

export default function FileStarLottie() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const animation: AnimationItem = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: fiveStarLottie,
      });

      // Other animations configuration or control logic can be added here

      return () => {
        animation.destroy(); // Clean up animation when the component unmounts
      };
    }
  }, []);
  return (
    <div>
      <div ref={container}></div>
    </div>
  );
}
