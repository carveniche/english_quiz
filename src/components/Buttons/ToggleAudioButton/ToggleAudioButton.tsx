import { useEffect } from "react";

import Button from "@material-ui/core/Button";
import MicIcon from "../../../icons/MicIcon";
import MicOffIcon from "../../../icons/MicOffIcon";

import useLocalAudioToggle from "../../../hooks/useLocalAudioToggle/useLocalAudioToggle";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { isTutorTechBoth } from "../../../utils/participantIdentity";

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
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

  const { muteAllParticipant, muteIndividualParticipant } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  useEffect(() => {
    muteUnmuteToggle();
  }, [muteAllParticipant]);

  useEffect(() => {
    if (muteIndividualParticipant.length > 0) {
      muteIndividualParticipantFn();
    }
  }, [muteIndividualParticipant]);

  const muteIndividualParticipantFn = () => {
    for (let i = 0; i < muteIndividualParticipant.length; i++) {
      if (
        muteIndividualParticipant[i].identity === role_name &&
        muteIndividualParticipant[i].muteStatus
      ) {
        muteAudioEnable();
        break;
      } else {
        unMuteAudioEnable();
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
