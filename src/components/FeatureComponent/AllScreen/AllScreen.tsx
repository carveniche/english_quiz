import { useEffect } from "react";

import Participant from "../../Participant/Participant";
import useParticipantsContext from "../../../hooks/useParticipantsContext/useParticipantsContext";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function AllScreen() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const { speakerViewParticipants } = useParticipantsContext();
  useEffect(() => {
    console.log("All Screen");
  }, []);
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ width: "50%", height: "100%" }}>
          <Participant
            participant={localParticipant}
            isLocalParticipant={true}
          />
        </div>
        <div style={{ width: "50%", height: "100%" }}>
          {speakerViewParticipants.map((participant) => {
            return (
              <Participant key={participant.sid} participant={participant} />
            );
          })}
        </div>
      </div>
    </>
  );
}
