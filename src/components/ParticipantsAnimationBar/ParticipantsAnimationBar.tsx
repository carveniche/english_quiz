import ClapIcon from "./ParticipantAnimationBarIcons/ClapIcon";
import SmileIcon from "./ParticipantAnimationBarIcons/SmileIcon";
import StarIcon from "./ParticipantAnimationBarIcons/StarIcon";
import ThumbsUpIcon from "./ParticipantAnimationBarIcons/ThumbsUpIcon";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import { Participant as IParticipant } from "twilio-video";
import MicIconParticipantAnimationBar from "./ParticipantAnimationBarIcons/MicIconParticipantAnimationBar";
import ScreenShareIcon from "./ParticipantAnimationBarIcons/ScreenShareIcon";

import useParticipantsAnimationBarDatatracks from "./ParticipantsAnimationBarDatatracks";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux/es/hooks/useSelector";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { RootState } from "../../redux/store";

interface ParticipantProps {
  participant: IParticipant;
}

interface animationCountType {
  type: string;
  count: number;
}

export default function ParticipantsAnimationBar({
  participant,
}: ParticipantProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [handleKeyClick] = useParticipantsAnimationBarDatatracks();
  const [animationCount, setAnimationCount] = useState({
    ThumbsUpIcon: {
      type: "",
      count: 0,
    },
    SmileIcon: {
      type: "",
      count: 0,
    },
    ClapIcon: {
      type: "",
      count: 0,
    },
    StarIcon: {
      type: "",
      count: 0,
    },
  });

  const animationDataTracks = useSelector(
    (state: RootState) => state.dataTrackStore
  );
  const animationButtonClicked = (identity: string, key: string) => {
    console.log("participant identity", identity);
    handleKeyClick(identity, key);
  };

  const screenShareButtonClicked = () => {};

  const muteIconButtonClicked = () => {};

  useEffect(() => {
    if (animationDataTracks.students.length) {
      showCountOfAnimation();
    }
  }, [animationDataTracks]);

  const showCountOfAnimation = () => {
    animationDataTracks?.students?.map((item) => {
      console.log("item identity", item.identity);

      if (item.identity === participant.identity) {
        setAnimationCount(item?.animationDetails);
      }
    });
  };

  return (
    <div className="flex absolute bg-participant-animation-bar-main flew-row flex-auto justify-between bottom-0 z-99 w-full h-[40px] pl-4 pr-4 py-2.5">
      <div className="flex gap-2 z-20">
        <div className="flex justify-center mb-3">
          <NetworkQualityLevel participant={participant} />
        </div>
        <button onClick={() => muteIconButtonClicked()}>
          <MicIconParticipantAnimationBar />
        </button>
        <span className="text-white">{participant.identity}</span>
        <button
          onClick={() =>
            animationButtonClicked(participant.identity, "ThumbsUpIcon")
          }
          className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
        >
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <ThumbsUpIcon />
            <span className="text-white">
              {animationCount["ThumbsUpIcon"]?.count || 0}
            </span>
          </div>
        </button>
        <button
          onClick={() =>
            animationButtonClicked(participant.identity, "ClapIcon")
          }
          className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
        >
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <ClapIcon />
            <span className="text-white">
              {animationCount?.ClapIcon?.count || 0}
            </span>
          </div>
        </button>
        <button
          onClick={() =>
            animationButtonClicked(participant.identity, "SmileIcon")
          }
          className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
        >
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <SmileIcon />
            <span className="text-white">
              {animationCount?.SmileIcon?.count || 0}
            </span>
          </div>
        </button>
        <button
          onClick={() =>
            animationButtonClicked(participant.identity, "StarIcon")
          }
          className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
        >
          <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
            <StarIcon />
            <span className="text-white">
              {animationCount?.StarIcon?.count || 0}
            </span>
          </div>
        </button>
      </div>
      <div className="flex gap-2 z-10">
        <button>
          <div
            onClick={() => screenShareButtonClicked()}
            className="flex justify-between gap-1 mt-[2px] mb-[2px]"
          >
            <ScreenShareIcon />
          </div>
        </button>
      </div>
    </div>
  );
}
