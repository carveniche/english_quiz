import React from "react";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import { Participant as IParticipant } from "twilio-video";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import { allExcludedParticipants } from "../../utils/excludeParticipant";

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
  fromScreen?: string;
  localParticipantIdentity?: string;
  remoteParticipantIdentity?: string;
}

export function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  isLocalParticipant,
  fromScreen,
  remoteParticipantIdentity,
}: ParticipantProps) {
  let isStudent = !allExcludedParticipants.includes(participant.identity);
  return (
    <ParticipantInfo
      participant={participant}
      isLocalParticipant={isLocalParticipant}
      screen={fromScreen}
      remoteParticipantIdentity={remoteParticipantIdentity}
    >
      <div
        style={{
          width: "inherit",
          height: "inherit",
        }}
        id={isStudent ? "videoStudentElement" : ""}
      >
        <ParticipantTracks
          participant={participant}
          videoOnly={videoOnly}
          enableScreenShare={enableScreenShare}
          isLocalParticipant={isLocalParticipant}
        />
      </div>
    </ParticipantInfo>
  );
}

export default React.memo(Participant);
