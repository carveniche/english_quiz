import Participant from "../Participant/Participant";
import useParticipantsContext from "../../hooks/useParticipantsContext/useParticipantsContext";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

export default function ParticipantList() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const { speakerViewParticipants } = useParticipantsContext();

  // if (speakerViewParticipants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <div>
      <div style={{ width: "100px" }}>
        <Participant participant={localParticipant} isLocalParticipant={true} />
      </div>
      <div style={{ width: "100px" }}>
        {speakerViewParticipants.map((participant) => {
          return (
            <Participant key={participant.sid} participant={participant} />
          );
        })}
      </div>
    </div>
  );
}
