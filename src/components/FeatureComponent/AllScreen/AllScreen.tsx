import Participant from "../../Participant/Participant";
import useParticipantsContext from "../../../hooks/useParticipantsContext/useParticipantsContext";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

import "./AllScreen.css";

import styled from "styled-components";

const Container = styled.button`
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 174px);
  border: 1px solid red;
  overflow: hidden;
  margin: auto;
  width: 100%;
  background: red;
  box-sizing: border-box;
`;

const Item = styled.button`
  width: 50%;
  max-height: 50%;

  /* The resulting background color will be based on the bg props. */
`;

export default function AllScreen() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const { speakerViewParticipants } = useParticipantsContext();

  return (
    <Container>
      <Item>
        <Participant participant={localParticipant} isLocalParticipant={true} />
      </Item>

      {speakerViewParticipants.map((participant) => {
        return (
          <Item>
            <Participant key={participant.sid} participant={participant} />
          </Item>
        );
      })}
      {speakerViewParticipants.length == 2 && <Item></Item>}
    </Container>
  );
}
