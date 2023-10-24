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
  isStudentId,
  isStudentName,
  isTutor,
  isTutorTechBoth,
} from "../../utils/participantIdentity";
import _isEqual from "lodash/isEqual";
import PlayLottieParticipantBar from "../PlayLottieParticipantBar/PlayLottiePaticipantBar";
import { useDispatch } from "react-redux";
import { disabledAnimation } from "../../redux/features/dataTrackStore";
import { Tooltip } from "@material-ui/core";
import CustomAlert from "../DisplayCustomAlert/CustomAlert";
import {
  setScreenShareStatus,
  setShowFiveStarAnimation,
} from "../../redux/features/liveClassDetails";
interface ParticipantProps {
  localParticipant?: ILocalParticipant;
  participant: IParticipant;
  screen?: String;
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
  const [muteParticipant, setMuteParticipant] = useState<boolean>(false);
  const [openAlertBox, setOpenAlertBox] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const animationStarted = useRef(false);
  const screenShareRef = useRef(false);
  const screenShareTimerRef = useRef<NodeJS.Timeout | undefined>();

  const animationDataTracks = useSelector(
    (state: RootState) => state.dataTrackStore
  );

  const { role_name, teacher_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const {
    muteIndividualParticipant,
    participantDeviceInformation,
    screenSharePermissionDenied,
    screenShareStatus,
  } = useSelector((state: RootState) => state.liveClassDetails);

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

  const checkStudentUsingIpadOrNot = (identity: string) => {
    let result = false;
    let studentIdentity = Number(isStudentId({ identity: identity }));

    for (let i = 0; i < participantDeviceInformation.length; i = i + 2) {
      if (
        participantDeviceInformation[i].platform === "iPad" &&
        participantDeviceInformation[i + 1].user_id === studentIdentity
      ) {
        result = true;
      }
    }

    return result;
  };

  const screenShareButtonClicked = (identity: string, key: string) => {
    let checkFirstDevice = checkStudentUsingIpadOrNot(identity);

    if (checkFirstDevice) {
      setAlertMessage(
        "The student has joined the live class from iPad using a browser so, student screen share will not work"
      );

      return;
    }

    if (
      screenSharePermissionDenied.status &&
      screenSharePermissionDenied.identity === identity
    ) {
      screenShareRef.current = false;
      clearTimeout(screenShareTimerRef.current);
    }

    if (screenShareRef.current) {
      setAlertMessage(
        "Please wait a moment before trying to request screenshare again."
      );
      return;
    }

    screenShareRef.current = true;
    screenShareTimerRef.current = setTimeout(() => {
      screenShareRef.current = false;
    }, 5000);

    dispatch(setScreenShareStatus(!screenShareStatus));

    if (!screenShareStatus) {
      handleKeyClick(identity, key, true);
    } else {
      handleKeyClick(identity, key, false);
    }
  };

  useEffect(() => {
    if (screenSharePermissionDenied.status) {
      dispatch(setScreenShareStatus(false));
    }
  }, [screenSharePermissionDenied.status]);

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

  useEffect(() => {
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      checkIfAnimationCountReachesFive();
    }
  }, [animationCount]);

  const clearFiveStarAnimation = () => {
    setTimeout(() => {
      dispatch(setShowFiveStarAnimation(false));
    }, 4000);
  };

  const checkIfAnimationCountReachesFive = () => {
    for (let key in animationCount) {
      if (animationCount[key].count === 5) {
        dispatch(setShowFiveStarAnimation(true));
        clearFiveStarAnimation();
      }
    }
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
            {!isTutor({ identity: participant.identity }) && (
              <>
                {muteIndividualParticipant.length > 0 ? (
                  muteIndividualParticipant?.map((item, index) => {
                    return (
                      <button
                        disabled={
                          !isTutorTechBoth({ identity: String(role_name) })
                        }
                        onClick={() =>
                          muteIconButtonClicked(participant.identity)
                        }
                        key={`muteState-${index}`}
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
              </>
            )}

            <span className="flex items-center justify-center text-white">
              {isTutor({ identity: participant.identity })
                ? String(teacher_name)
                : isStudentName({ identity: participant.identity })}
            </span>
            {!isTutor({ identity: participant.identity }) && (
              <>
                <button
                  disabled={!isTutorTechBoth({ identity: String(role_name) })}
                  onClick={() =>
                    animationButtonClicked(participant.identity, "ThumbsUpIcon")
                  }
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
                >
                  <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                    <StarIcon />
                    <span className="text-white">
                      {animationCount["StarIcon"]?.count || 0}
                    </span>
                  </div>
                </button>
              </>
            )}
          </div>
          {!isTutor({ identity: participant.identity }) && (
            <div className="flex gap-2 z-10">
              <Tooltip title="ScreenShare" arrow placement="top">
                <span>
                  <button
                    disabled={!isTutorTechBoth({ identity: String(role_name) })}
                    onClick={() =>
                      screenShareButtonClicked(
                        participant.identity,
                        "ScreenShare"
                      )
                    }
                  >
                    <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                      {screenShareStatus ? (
                        <ScreenShareOnIcon />
                      ) : (
                        <ScreenShareIcon />
                      )}
                    </div>
                  </button>
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex flex-col flew-row flex-auto justify-between bottom-0 z-10 w-full max-w-[200px] ${
            isTutor({ identity: participant.identity }) ? "" : "h-[70px]"
          }`}
        >
          <div className="flex justify-between bg-participant-animation-bar-main-otherScreen w-full h-[30px]">
            <div className="flex flex-row justify-evenly">
              <div className="flex justify-center mb-3 items-start">
                <NetworkQualityLevel participant={participant} />
              </div>

              {!isTutor({ identity: participant.identity }) && (
                <>
                  {muteIndividualParticipant.length > 0 ? (
                    muteIndividualParticipant?.map((item, index) => {
                      return (
                        <button
                          disabled={
                            !isTutorTechBoth({ identity: String(role_name) })
                          }
                          onClick={() =>
                            muteIconButtonClicked(participant.identity)
                          }
                          key={`muteState-${index}`}
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
                      disabled={
                        !isTutorTechBoth({ identity: String(role_name) })
                      }
                      onClick={() =>
                        muteIconButtonClicked(participant.identity)
                      }
                    >
                      {muteParticipant ? <UnMuteIcon /> : <MuteIcon />}
                    </button>
                  )}
                </>
              )}

              <span className="flex items-center justify-center text-white">
                {isTutor({ identity: participant.identity })
                  ? String(teacher_name)
                  : isStudentName({ identity: participant.identity })}
              </span>
            </div>
            {!isTutor({ identity: participant.identity }) && (
              <div className="flex gap-2 z-10 mr-1" title="ScreenShare">
                <Tooltip title="ScreenShare" arrow placement="top">
                  <span>
                    <button
                      disabled={
                        !isTutorTechBoth({ identity: String(role_name) })
                      }
                      onClick={() =>
                        screenShareButtonClicked(
                          participant.identity,
                          "ScreenShare"
                        )
                      }
                    >
                      <div className="flex justify-between gap-1 mt-[2px] mb-[2px]">
                        {screenShareStatus ? (
                          <ScreenShareOnIcon />
                        ) : (
                          <ScreenShareIcon />
                        )}
                      </div>
                    </button>
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
          {!isTutor({ identity: participant.identity }) && (
            <div className="flex bg-black w-full h-[40px] justify-center items-center">
              <div className=" flex mt-1 h-full justify-center items-center">
                <button
                  disabled={!isTutorTechBoth({ identity: String(role_name) })}
                  onClick={() =>
                    animationButtonClicked(participant.identity, "ThumbsUpIcon")
                  }
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
                  className="flex h-[25px] w-[29px]  py-2 px-6 content-center justify-center items-center gap-4 bg-participant-animation-bar hover:bg-participant-animation-bar-hover rounded-full"
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
          )}
        </div>
      )}

      {alertMessage !== "" && (
        <CustomAlert
          variant="info"
          headline={alertMessage}
          open={openAlertBox}
          handleClose={() => setOpenAlertBox(false)}
        />
      )}
    </>
  );
}
