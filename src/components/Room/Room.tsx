import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import styled from "styled-components";
import Participant from "../Participant/Participant";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ParticipantsAnimationBar from "../ParticipantsAnimationBar/ParticipantsAnimationBar";
import { allExcludedParticipant } from "../../utils/participantIdentity";
import ScreenShareDraggable from "../DraggableComponent/ScreenShareDraggable";
import useLocalAudioToggle from "../../hooks/useLocalAudioToggle/useLocalAudioToggle";
import { useEffect } from "react";

import ChatWindow from "../ChatWindow/ChatWindow";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";
import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
interface remotePCountInterface {
  remotepcount: number;
}

const ContainerAllScreen = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100%);
  overflow: hidden;
  margin: auto;
  width: 100%;
  box-sizing: border-box;
  gap: 5px;
`;

const Item = styled.div<remotePCountInterface>`
  width: ${(props) =>
    props.remotepcount === 0
      ? "calc(100% - 5px)"
      : props.remotepcount === 1
      ? "calc(50% - 5px)"
      : props.remotepcount === 2 || props.remotepcount === 3
      ? "calc(50% - 5px)"
      : "calc(33% - 5px)"};
  max-height: ${(props) =>
    props.remotepcount === 0 || props.remotepcount === 1
      ? "100%"
      : props.remotepcount === 2 || props.remotepcount == 3
      ? "50%"
      : "100%"};
  position: relative;
`;

export default function Room() {
  const { room, toggleScreenShare } = useVideoContext();

  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  const remotePCount = speakerViewParticipants.length;

  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
  );

  const screenShareState = useSelector(
    (state: RootState) => state.dataTrackStore.ShreenShareTracks
  );

  useEffect(() => {
    if (screenShareState.identity === room?.localParticipant.identity) {
      toggleScreenShare();
    }
  }, [screenShareState.publishedState, !screenShareState.publishedState]);

  useEffect(() => {
    if (isAudioEnabled) {
      toggleAudioEnabled();
    }
  }, []);

  console.log("Room Component Mouting");

  return (
    <>
      <>
        {screenShareState.identity !== room?.localParticipant.identity &&
          screenShareState.publishedState && <ScreenShareDraggable />}
        {currentSelectedScreen === "/allScreen" ? (
          <ContainerAllScreen>
            <Item remotepcount={remotePCount} key={localParticipant.sid}>
              {!allExcludedParticipant({
                identity: localParticipant.identity,
              }) && (
                <>
                  <ParticipantsAnimationBar
                    localParticipant={localParticipant}
                    participant={localParticipant}
                    screen={"allScreen"}
                  />
                </>
              )}
              <Participant
                participant={localParticipant}
                isLocalParticipant={true}
              />
            </Item>

            {speakerViewParticipants.map((participant) => {
              return (
                <Item remotepcount={remotePCount} key={participant.sid}>
                  {!allExcludedParticipant({
                    identity: participant.identity,
                  }) && (
                    <ParticipantsAnimationBar
                      localParticipant={localParticipant}
                      participant={participant}
                      screen={"allScreen"}
                    />
                  )}
                  <Participant
                    key={participant.sid}
                    participant={participant}
                  />
                </Item>
              );
            })}
          </ContainerAllScreen>
        ) : (
          <></>
        )}
      </>

      <ChatWindow />
      <BackgroundSelectionDialog />
    </>
  );
}
