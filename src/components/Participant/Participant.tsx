import React from "react";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import { Participant as IParticipant } from "twilio-video";

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

export function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  isLocalParticipant,
}: ParticipantProps) {
  return (
    <ParticipantTracks
      participant={participant}
      videoOnly={videoOnly}
      enableScreenShare={enableScreenShare}
      isLocalParticipant={isLocalParticipant}
    />
  );
}

export default React.memo(Participant);
