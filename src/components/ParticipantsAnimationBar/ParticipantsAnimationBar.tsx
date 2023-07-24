import ClapIcon from "./ParticipantAnimationBarIcons/ClapIcon";
import SmileIcon from "./ParticipantAnimationBarIcons/SmileIcon";
import StarIcon from "./ParticipantAnimationBarIcons/StarIcon";
import ThumbsUpIcon from "./ParticipantAnimationBarIcons/ThumbsUpIcon";

import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";

import { Participant as IParticipant } from "twilio-video";
import MicIconParticipantAnimationBar from "./ParticipantAnimationBarIcons/MicIconParticipantAnimationBar";

interface ParticipantProps {
  participant: IParticipant;
}

export default function ParticipantsAnimationBar({
  participant,
}: ParticipantProps) {
  return (
    <div className="flex absolute bg-participant-animation-bar-main flew-row flex-auto justify-between bottom-0 z-99 w-full h-[40px] pl-4 pr-4 py-2.5">
      <div className="flex gap-2 ">
        <div className="flex justify-center mb-3">
          <NetworkQualityLevel participant={participant} />
        </div>
        <MicIconParticipantAnimationBar />
        <span className="text-white">Name</span>
        <button className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded">
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <ThumbsUpIcon />
            <span className="text-white">1</span>
          </div>
        </button>
        <button className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded">
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <ClapIcon />
            <span className="text-white">1</span>
          </div>
        </button>
        <button className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded">
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <SmileIcon />
            <span className="text-white">1</span>
          </div>
        </button>
        <button className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded">
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <StarIcon />
            <span className="text-white">1</span>
          </div>
        </button>
      </div>
      <div className="flex">
        <span className="text-white">Screen Share</span>
      </div>
    </div>
  );
}
