import React from "react";
import { Rnd } from "react-rnd";
import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { Participant } from "../Participant/Participant";
import ParticipantsAnimationBar from "../ParticipantsAnimationBar/ParticipantsAnimationBar";
import {
  allExcludedParticipant,
  isTutor,
} from "../../utils/participantIdentity";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useEffect, useState } from "react";
import { excludeParticipantTechSmParent } from "../../utils/excludeParticipant";

interface FloatingParticipantProps {
  screen: any;
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function FloatingParticipant({
  screen,
  parentRef,
}: FloatingParticipantProps) {
  const [screenName, setScreenName] = useState("");
  const [showTeacherView, setShowTeacherView] = useState(false);
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  useEffect(() => {
    if (screen) {
      setScreenName(screen);
    }
  }, [screen]);

  useEffect(() => {
    if (
      screenName !== "/allscreen" &&
      screenName !== "/myscreen" &&
      screenName !== ""
    ) {
      setShowTeacherView(true);
    } else {
      setShowTeacherView(false);
    }
  }, [screenName, screen]);

  const showViewWithTeacher = () => {
    return speakerViewParticipants.map((participant) => {
      return excludeParticipantTechSmParent.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : (
        <div
          className="relative max-h-[200px] max-w-[290px]"
          style={{
            marginTop: "10px",
          }}
          key={participant.sid}
        >
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
          {!allExcludedParticipant({
            identity: participant.identity,
          }) && (
            <ParticipantsAnimationBar
              localParticipant={localParticipant}
              participant={participant}
              screen="myscreen"
            />
          )}
        </div>
      );
    });
  };

  const showViewWithoutTeacher = () => {
    return speakerViewParticipants.map((participant) => {
      return excludeParticipantTechSmParent.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : !isTutor({ identity: participant.identity }) ? (
        <div
          className="relative max-h-[200px] max-w-[290px]"
          style={{
            marginTop: "10px",
          }}
          key={participant.sid}
        >
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
          {!allExcludedParticipant({
            identity: participant.identity,
          }) && (
            <ParticipantsAnimationBar
              localParticipant={localParticipant}
              participant={participant}
              screen="myscreen"
            />
          )}
        </div>
      ) : null;
    });
  };

  const showSelfParticipantView = () => {
    return (
      <div className="relative max-h-[200px] max-w-[290px]">
        <Participant
          participant={localParticipant}
          isLocalParticipant={true}
          remoteParticipantIdentity={localParticipant.identity}
          fromScreen="allOtherScreens"
        />
        {!allExcludedParticipant({
          identity: localParticipant.identity,
        }) && (
          <ParticipantsAnimationBar
            localParticipant={localParticipant}
            participant={localParticipant}
            screen="myscreen"
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        zIndex: 999,
        width: 200,
        height: "fit-content",
      }}
    >
      <Rnd bounds={parentRef.current || ""} enableResizing={false}>
        <>
          {screenName !== "/myscreen"
            ? showSelfParticipantView()
            : screenName === "/myscreen" &&
              !isTutor({ identity: localParticipant.identity }) &&
              showSelfParticipantView()}
          {showTeacherView ? showViewWithTeacher() : showViewWithoutTeacher()}
        </>
      </Rnd>
    </div>
  );
}
