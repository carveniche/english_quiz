import React, { useEffect, useRef } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import ScreenRecording from "./ScreenRecording";

import { mapToArray } from "../../utils";
import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import "../../bootstrap.css";
export default function MainScreenRecording() {
  const { room } = useVideoContext();
  const speakerViewParticipants = useSpeakerViewParticipants();

  const ref = useRef();
  const ref2 = useRef();
  return (
    <>
      {room?.localParticipant.identity === "tutor" && (
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
