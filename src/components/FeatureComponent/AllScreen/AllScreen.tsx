import React from "react";
import styled from "styled-components";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { finalRemoteParticipantCount } from "../../../utils/common";
import { Participant } from "../../Participant/Participant";
import ParticipantsAnimationBar from "../../ParticipantsAnimationBar/ParticipantsAnimationBar";
import {
  allExcludedParticipant,
  isTutor,
} from "../../../utils/participantIdentity";
import { excludeParticipantTechSmParent } from "../../../utils/excludeParticipant";

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

export default function AllScreen() {
  const { room } = useVideoContext();

  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  const remotePCount = finalRemoteParticipantCount(
    speakerViewParticipants,
    localParticipant.identity
  );

  const isTutorLocalParticipant = isTutor({
    identity: localParticipant.identity,
  });

  const TeacherViewFirst = () => {
    const tutorParticipants = speakerViewParticipants.filter((participant) =>
      isTutor({ identity: participant.identity })
    );

    const otherParticipants = speakerViewParticipants.filter(
      (participant) => !isTutor({ identity: participant.identity })
    );

    const mappedTutors = tutorParticipants.map((participant) => {
      return excludeParticipantTechSmParent.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen={"allscreen"}
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : (
        <Item remotepcount={remotePCount} key={participant.sid}>
          {!allExcludedParticipant({
            identity: participant.identity,
          }) && (
            <ParticipantsAnimationBar
              localParticipant={localParticipant}
              participant={participant}
              screen={"allscreen"}
            />
          )}
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen={"allscreen"}
            remoteParticipantIdentity={participant.identity}
          />
        </Item>
      );
    });

    const mappedOtherParticipants = otherParticipants.map((participant) => {
      return excludeParticipantTechSmParent.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen={"allscreen"}
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : (
        <Item remotepcount={remotePCount} key={participant.sid}>
          {!allExcludedParticipant({
            identity: participant.identity,
          }) && (
            <ParticipantsAnimationBar
              localParticipant={localParticipant}
              participant={participant}
              screen={"allscreen"}
            />
          )}
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen={"allscreen"}
            remoteParticipantIdentity={participant.identity}
          />
        </Item>
      );
    });

    const finalMapping = mappedTutors.concat(mappedOtherParticipants);

    return finalMapping;
  };

  return (
    <ContainerAllScreen>
      {isTutorLocalParticipant ? (
        <>
          {!excludeParticipantTechSmParent.includes(
            localParticipant.identity
          ) ? (
            <Item remotepcount={remotePCount} key={localParticipant.sid}>
              {!allExcludedParticipant({
                identity: localParticipant.identity,
              }) && (
                <>
                  <ParticipantsAnimationBar
                    localParticipant={localParticipant}
                    participant={localParticipant}
                    screen={"allscreen"}
                  />
                </>
              )}
              <Participant
                participant={localParticipant}
                isLocalParticipant={true}
                fromScreen={"allscreen"}
              />
            </Item>
          ) : null}
          {speakerViewParticipants.map((participant) => {
            return excludeParticipantTechSmParent.includes(
              participant.identity
            ) ? (
              <React.Fragment key={participant.sid}>
                <Participant
                  key={participant.sid}
                  participant={participant}
                  fromScreen={"allscreen"}
                  remoteParticipantIdentity={participant.identity}
                />
              </React.Fragment>
            ) : (
              <Item remotepcount={remotePCount} key={participant.sid}>
                {!allExcludedParticipant({
                  identity: participant.identity,
                }) && (
                  <ParticipantsAnimationBar
                    localParticipant={localParticipant}
                    participant={participant}
                    screen={"allscreen"}
                  />
                )}
                <Participant
                  key={participant.sid}
                  participant={participant}
                  fromScreen={"allscreen"}
                  remoteParticipantIdentity={participant.identity}
                />
              </Item>
            );
          })}
        </>
      ) : (
        <>
          {TeacherViewFirst()}

          {!excludeParticipantTechSmParent.includes(
            localParticipant.identity
          ) ? (
            <Item remotepcount={remotePCount} key={localParticipant.sid}>
              {!allExcludedParticipant({
                identity: localParticipant.identity,
              }) && (
                <>
                  <ParticipantsAnimationBar
                    localParticipant={localParticipant}
                    participant={localParticipant}
                    screen={"allscreen"}
                  />
                </>
              )}
              <Participant
                participant={localParticipant}
                isLocalParticipant={true}
                fromScreen={"allscreen"}
              />
            </Item>
          ) : null}
        </>
      )}
    </ContainerAllScreen>
  );
}
