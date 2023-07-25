import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import starIcon from "../../assets/LottieFiles/star.json";
export default function StarLottie() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      const animation: AnimationItem = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: starIcon,
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
