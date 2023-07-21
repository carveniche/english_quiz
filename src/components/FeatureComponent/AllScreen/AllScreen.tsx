import Participant from "../../Participant/Participant";
import useParticipantsContext from "../../../hooks/useParticipantsContext/useParticipantsContext";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

import "./AllScreen.css";

import styled from "styled-components";

interface remotePCountInterface {
  remotePCount: number;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 174px);
  overflow: hidden;
  margin: auto;
  width: 100%;
  box-sizing: border-box;
  gap: 5px;
`;

const Item = styled.div<remotePCountInterface>`
  width: ${(props) =>
    props.remotePCount === 0
      ? "calc(100% - 5px)"
      : props.remotePCount === 1
      ? "calc(50% - 5px)"
      : props.remotePCount === 2 || props.remotePCount === 3
      ? "calc(50% - 5px)"
      : "calc(33% - 5px)"};
  max-height: ${(props) =>
    props.remotePCount === 0 || props.remotePCount === 1
      ? "100%"
      : props.remotePCount === 2 || props.remotePCount == 3
      ? "50%"
      : "100%"};
  /* The resulting background color will be based on the bg props. */
`;

export default function AllScreen() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const { speakerViewParticipants } = useParticipantsContext();
  const remotePCount = speakerViewParticipants.length;

  return (
    <Container>
      <Item remotePCount={remotePCount}>
        <Participant participant={localParticipant} isLocalParticipant={true} />
      </Item>

      {speakerViewParticipants.map((participant) => {
        return (
          <Item remotePCount={remotePCount}>
            <Participant key={participant.sid} participant={participant} />
          </Item>
        );
      })}
    </Container>
  );
}
