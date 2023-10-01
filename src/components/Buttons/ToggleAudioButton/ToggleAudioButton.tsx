import { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import MicIcon from "../../../icons/MicIcon";
import MicOffIcon from "../../../icons/MicOffIcon";

import useLocalAudioToggle from "../../../hooks/useLocalAudioToggle/useLocalAudioToggle";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { addMuteIndividualParticipant } from "../../../redux/features/liveClassDetails";
import useRoomState from "../../../hooks/useRoomState/useRoomState";

export default function ToggleAudioButton(props: {
  disabled?: boolean;
  className?: string;
}) {
  const [
    isAudioEnabled,
    toggleAudioEnabled,
    muteAudioEnable,
    unMuteAudioEnable,
  ] = useLocalAudioToggle();
  const { localTracks, room } = useVideoContext();

  const { pathname } = useLocation();
  const roomState = useRoomState();
  const dispatch = useDispatch();
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

  const { muteAllParticipant, muteIndividualParticipant } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const [teacherMutedParticipant, setTeacherMutedParticipant] = useState(false);

  useEffect(() => {
    if (roomState !== "disconnected" && !teacherMutedParticipant) {
      sendMuteStatusToAllParticipants();
    }
  }, [isAudioEnabled, roomState]);

  const sendMuteStatusToAllParticipants = () => {
    const muteStatus = !isAudioEnabled ? true : false;

    if (room && !isTutorTechBoth({ identity: String(role_name) })) {
      setTimeout(() => {
        const [localDataTrackPublication] = [
          ...room.localParticipant.dataTracks.values(),
        ];
        let DataTrackObj = {
          pathName: pathname === "/" ? null : pathname,
          value: {
            datatrackName: "MuteParticipant",
            muteStatus: muteStatus,
            identity: role_name,
            fromScreen: "ParticipantSelfClickedMuteBtn",
          },
        };

        localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
        dispatch(
          addMuteIndividualParticipant({
            muteStatus: muteStatus,
            identity: role_name,
            fromScreen: "ParticipantSelfClickedMuteBtn",
          })
        );
      }, 500);
    }
  };

  useEffect(() => {
    muteUnmuteToggle();
  }, [muteAllParticipant]);

  useEffect(() => {
    if (
      muteIndividualParticipant.length > 0 &&
      !isTutorTechBoth({ identity: String(role_name) })
    ) {
      muteIndividualParticipantFn();
    }
  }, [muteIndividualParticipant]);

  const toggleTeacherMutedState = () => {
    setTeacherMutedParticipant(true);

    setTimeout(() => {
      setTeacherMutedParticipant(false);
    }, 500);
  };

  const muteIndividualParticipantFn = () => {
    for (let i = 0; i < muteIndividualParticipant.length; i++) {
      if (
        muteIndividualParticipant[i].fromScreen === "TeacherMutedParticipant"
      ) {
        console.log("Inside if now we can toggle Audio Btn");
        if (
          muteIndividualParticipant[i].identity === role_name &&
          muteIndividualParticipant[i].muteStatus
        ) {
          muteAudioEnable();
          toggleTeacherMutedState();
          break;
        } else {
          unMuteAudioEnable();
          toggleTeacherMutedState();
        }
      }
    }
  };

  const muteUnmuteToggle = () => {
    if (muteAllParticipant === undefined) {
      return;
    }
    if (
      !isTutorTechBoth({ identity: String(role_name) }) &&
      muteAllParticipant
    ) {
      muteAudioEnable();
    } else if (
      !isTutorTechBoth({ identity: String(role_name) }) &&
      !muteAllParticipant
    ) {
      unMuteAudioEnable();
    } else {
    }
  };

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? "No Audio" : isAudioEnabled ? "Mute" : "Unmute"}
    </Button>
  );
}
