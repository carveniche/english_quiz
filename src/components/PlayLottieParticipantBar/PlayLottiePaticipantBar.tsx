import ThumbsUpLottie from "../LottieAnimations/ThumbsUpLottie";
import ClapLottie from "../LottieAnimations/ClapLottie";
import SmileLottie from "../LottieAnimations/SmileLottie";
import StarLottie from "../LottieAnimations/StarLottie";

interface PlayLottieParticipantBar {
  type: string;
}

export default function PlayLottieParticipantBar({
  type,
}: PlayLottieParticipantBar) {
  console.log("Type inside", type);
  return (
    <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-between w-[200px] h-[200px] z-10">
      {type === "ThumbsUpIcon" ? (
        <ThumbsUpLottie />
      ) : type === "ClapIcon" ? (
        <ClapLottie />
      ) : type === "SmileIcon" ? (
        <SmileLottie />
      ) : (
        <StarLottie />
      )}
    </div>
  );
}
