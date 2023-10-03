import React, { useEffect, useRef } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import ScreenRecording from "./ScreenRecording";
import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { isTutor } from "../../utils/participantIdentity";
import { useSelector } from "react-redux";
export default function MainScreenRecording() {
  const { room } = useVideoContext();
  const speakerViewParticipants = useSpeakerViewParticipants();

  const { role_name } = useSelector((state) => state.videoCallTokenData);

  const ref = useRef();
  const ref2 = useRef();
  return (
    <>
      {isTutor({ identity: String(role_name) }) && (
        <ScreenRecording
          ref={ref}
          screenRecordingRef2={ref2}
          room={room}
          userJoined={true}
          participantLength={speakerViewParticipants.length || 0}
        />
      )}
    </>
  );
}
