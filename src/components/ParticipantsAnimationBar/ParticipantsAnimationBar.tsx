import ClapIcon from "./ParticipantAnimationBarIcons/ClapIcon";
import SmileIcon from "./ParticipantAnimationBarIcons/SmileIcon";
import StarIcon from "./ParticipantAnimationBarIcons/StarIcon";
import ThumbsUpIcon from "./ParticipantAnimationBarIcons/ThumbsUpIcon";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import {
  Participant as IParticipant,
  LocalParticipant as ILocalParticipant,
} from "twilio-video";
import MuteIcon from "./ParticipantAnimationBarIcons/MuteIcon";
import UnMuteIcon from "./ParticipantAnimationBarIcons/UnMuteIcon";
import ScreenShareIcon from "./ParticipantAnimationBarIcons/ScreenShareIcon";
import ScreenShareOnIcon from "./ParticipantAnimationBarIcons/ScreenShareOnIcon";

import useParticipantsAnimationBarDatatracks from "./ParticipantsAnimationBarDatatracks";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../../redux/store";
import {
  isStudentName,
  isTutorTechBoth,
} from "../../utils/participantIdentity";
import _isEqual from "lodash/isEqual";
import PlayLottieParticipantBar from "../PlayLottieParticipantBar/PlayLottiePaticipantBar";
import { useDispatch } from "react-redux";
import { disabledAnimation } from "../../redux/features/dataTrackStore";
interface ParticipantProps {
  localParticipant?: ILocalParticipant;
  participant: IParticipant;
  screen?: String;
}

interface MuteParticipantDetailsProps {
  identity: string;
  muteStatus: boolean;
}

export default function ParticipantsAnimationBar({
  participant,
  screen,
}: ParticipantProps) {
  const dispatch = useDispatch();
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
  const [animationPariticipantIdentity, setAnimationParticipantIdentity] =
    useState<string>("");
  const [animationPariticipantType, setAnimationParticipantType] =
    useState<string>("");
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [studentShareScreen, setStundentShareScreen] = useState<boolean>(false);
  const [muteParticipant, setMuteParticipant] = useState<boolean>(false);
  const [mutedParticipantsDetails, setMutedParticipantsDetails] = useState([]);

  const animationStarted = useRef(false);
  const screenShareRef = useRef(false);

  const animationDataTracks = useSelector(
    (state: RootState) => state.dataTrackStore
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const { muteIndividualParticipant } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const animationButtonClicked = (identity: string, key: string) => {
    if (animationStarted.current) {
      return;
    }
    setAnimationParticipantIdentity(identity);
    setAnimationParticipantType(key);
    handleKeyClick(identity, key);
    handleAnimationTiming();
  };

  const handleAnimationTiming = () => {
    setStartAnimation(true);
    animationStarted.current = true;
    setTimeout(() => {
      setStartAnimation(false);
      dispatch(disabledAnimation(false));
      animationStarted.current = false;
    }, 2500);
  };

  const screenShareButtonClicked = (identity: string, key: string) => {
    if (screenShareRef.current) {
      return;
    }

    screenShareRef.current = true;
    setTimeout(() => {
      screenShareRef.current = false;
    }, 2500);

    setStundentShareScreen(!studentShareScreen);
    if (!studentShareScreen) {
      handleKeyClick(identity, key, true);
    } else {
      handleKeyClick(identity, key, false);
    }
  };

  const muteIconButtonClicked = (identity: string) => {
    if (!muteParticipant) {
      handleKeyClick(identity, "MuteParticipant", true);
      setMuteParticipant(true);
    } else {
      handleKeyClick(identity, "MuteParticipant", false);
      setMuteParticipant(false);
    }
  };

  useEffect(() => {
    if (animationDataTracks.animationTrackIdentityAndType.count === 0) {
      return;
    }
    if (animationDataTracks.students.length) {
      showCountOfAnimation();
    }

    if (
      animationDataTracks.animationTrackIdentityAndType.identity &&
      animationDataTracks.animationTrackIdentityAndType.type
    ) {
      setAnimationParticipantIdentity(
        animationDataTracks.animationTrackIdentityAndType.identity
      );
      setAnimationParticipantType(
        animationDataTracks.animationTrackIdentityAndType.type
      );
      if (animationDataTracks.animationTrackIdentityAndType.isAnimationOn) {
        handleAnimationTiming();
      }
    }
  }, [animationDataTracks.animationTrackIdentityAndType.count]);

  const showCountOfAnimation = () => {
    animationDataTracks?.students?.map((item) => {
      if (item.identity === participant.identity) {
        //@ts-ignore
        setAnimationCount(item?.animationDetails);
      }
    });
  };

  return (
    <>
      {participant.identity === animationPariticipantIdentity &&
        startAnimation && (
          <PlayLottieParticipantBar type={animationPariticipantType} />
        )}
      {screen === "allscreen" ? (
        <div className="flex absolute bg-participant-animation-bar-main flew-row flex-auto justify-between bottom-0 z-10 w-full h-[40px] pl-4 pr-4 py-2.5">
          <div className="flex gap-2 z-20">
            <div className="flex justify-center mb-3">
              <NetworkQualityLevel participant={participant} />
            </div>
            {muteIndividualParticipant.length > 0 ? (
              muteIndividualParticipant?.map((item) => {
                return (
                  <button
                    disabled={!isTutorTechBoth({ identity: String(role_name) })}
                    onClick={() => muteIconButtonClicked(participant.identity)}
                  >
                    {item.identity === participant.identity ? (
                      item.muteStatus ? (
                        <UnMuteIcon />
                      ) : (
                        <MuteIcon />
                      )
                    ) : null}
                  </button>
                );
              })
            ) : (
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() => muteIconButtonClicked(participant.identity)}
              >
                {muteParticipant ? <UnMuteIcon /> : <MuteIcon />}
              </button>
            )}

            <span className="text-white">
              {isStudentName({ identity: participant.identity })}
            </span>
            <button
              disabled={!isTutorTechBoth({ identity: String(role_name) })}
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
              disabled={!isTutorTechBoth({ identity: String(role_name) })}
              onClick={() =>
                animationButtonClicked(participant.identity, "ClapIcon")
              }
              className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
            >
              <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                <ClapIcon />
                <span className="text-white">
                  {animationCount["ClapIcon"]?.count || 0}
                </span>
              </div>
            </button>
            <button
              disabled={!isTutorTechBoth({ identity: String(role_name) })}
              onClick={() =>
                animationButtonClicked(participant.identity, "SmileIcon")
              }
              className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
            >
              <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                <SmileIcon />
                <span className="text-white">
                  {animationCount["SmileIcon"]?.count || 0}
                </span>
              </div>
            </button>
            <button
              disabled={!isTutorTechBoth({ identity: String(role_name) })}
              onClick={() =>
                animationButtonClicked(participant.identity, "StarIcon")
              }
              className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
            >
              <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                <StarIcon />
                <span className="text-white">
                  {animationCount["StarIcon"]?.count || 0}
                </span>
              </div>
            </button>
          </div>
          <div className="flex gap-2 z-10" title="ScreenShare">
            <button
              disabled={!isTutorTechBoth({ identity: String(role_name) })}
              onClick={() =>
                screenShareButtonClicked(participant.identity, "ScreenShare")
              }
            >
              <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                {studentShareScreen ? (
                  <ScreenShareOnIcon />
                ) : (
                  <ScreenShareIcon />
                )}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flew-row flex-auto justify-between bottom-0 z-10 w-full h-[60px]">
          <div className="flex justify-between bg-participant-animation-bar-main-otherScreen w-full h-[40px]">
            <div className="flex flex-row justify-evenly">
              <div className="flex justify-center mb-3">
                <NetworkQualityLevel participant={participant} />
              </div>
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() => muteIconButtonClicked(participant.identity)}
              >
                {muteParticipant ? <UnMuteIcon /> : <MuteIcon />}
              </button>

              <span className="text-white">
                {isStudentName({ identity: participant.identity })}
              </span>
            </div>
            <div className="flex gap-2 z-10 mr-1" title="ScreenShare">
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() =>
                  screenShareButtonClicked(participant.identity, "ScreenShare")
                }
              >
                <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                  {studentShareScreen ? (
                    <ScreenShareOnIcon />
                  ) : (
                    <ScreenShareIcon />
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className="flex bg-black w-full h-[30px] mt-2 mb-4">
            <div className=" flex mt-1 h-full">
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
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
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() =>
                  animationButtonClicked(participant.identity, "ClapIcon")
                }
                className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
              >
                <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                  <ClapIcon />
                  <span className="text-white">
                    {animationCount["ClapIcon"]?.count || 0}
                  </span>
                </div>
              </button>
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() =>
                  animationButtonClicked(participant.identity, "SmileIcon")
                }
                className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
              >
                <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                  <SmileIcon />
                  <span className="text-white">
                    {animationCount["SmileIcon"]?.count || 0}
                  </span>
                </div>
              </button>
              <button
                disabled={!isTutorTechBoth({ identity: String(role_name) })}
                onClick={() =>
                  animationButtonClicked(participant.identity, "StarIcon")
                }
                className="flex h-[20px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar rounded"
              >
                <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                  <StarIcon />
                  <span className="text-white">
                    {animationCount["StarIcon"]?.count || 0}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
