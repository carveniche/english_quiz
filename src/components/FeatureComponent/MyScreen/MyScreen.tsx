import styled from "styled-components";
import { Participant } from "../../Participant/Participant";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import {
  allExcludedParticipant,
  isTutor,
} from "../../../utils/participantIdentity";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import FloatingParticipant from "../../FloatingParticipant/FloatingParticipant";
import ParticipantsAnimationBar from "../../ParticipantsAnimationBar/ParticipantsAnimationBar";

const ContainerMyScreen = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100%);
  overflow: hidden;
  margin: auto;
  width: 100%;
  box-sizing: border-box;
  gap: 5px;
`;

const Item = styled.div`
  width: calc(100% - 200px);
  max-height: 100%;
  position: relative;
  border: "1px solid black";
`;

export default function MyScreen() {
  const { room } = useVideoContext();

  const localParticipant = room!.localParticipant;
  const speakerViewParticipants = useSpeakerViewParticipants();

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  return (
    <ContainerMyScreen>
      <Item key={localParticipant.sid}>
        {isTutor({ identity: String(role_name) }) ? (
          <Participant
            participant={localParticipant}
            isLocalParticipant={true}
          />
        ) : (
          <>
            {speakerViewParticipants.map((participant) => {
              return (
                participant.identity === "tutor" && (
                  <Participant
                    key={participant.sid}
                    participant={participant}
                  />
                )
              );
            })}
          </>
        )}
      </Item>
      <FloatingParticipant>
        <div className="border border-black min-w-[190px] min-h-[150px]">
          {speakerViewParticipants.map((participant) => {
            return (
              participant.identity !== "tutor" && (
                <>
                  {!allExcludedParticipant({
                    identity: participant.identity,
                  }) && (
                    <ParticipantsAnimationBar
                      localParticipant={localParticipant}
                      participant={participant}
                      screen={"myScreen"}
                    />
                  )}
                  <Participant
                    key={participant.sid}
                    participant={participant}
                  />
                </>
              )
            );
          })}
        </div>
      </FloatingParticipant>
    </ContainerMyScreen>
  );
}