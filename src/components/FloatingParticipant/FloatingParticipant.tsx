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
import { excludeParticipant } from "../../utils/excludeParticipant";

export default function FloatingParticipant(screen: any) {
  const [screenName, setScreenName] = useState("");
  const [showTeacherView, setShowTeacherView] = useState(false);
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  useEffect(() => {
    if (screen) {
      setScreenName(screen.screen);
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
      return excludeParticipant.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : (
        <div className="max-h-[200px]" key={participant.sid}>
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
              screen={"myscreen"}
            />
          )}
        </div>
      );
    });
  };

  const showViewWithoutTeacher = () => {
    return speakerViewParticipants.map((participant) => {
      return excludeParticipant.includes(participant.identity) ? (
        <React.Fragment key={participant.sid}>
          <Participant
            key={participant.sid}
            participant={participant}
            fromScreen="allOtherScreens"
            remoteParticipantIdentity={participant.identity}
          />
        </React.Fragment>
      ) : participant.identity !== "tutor" ? (
        <div className="max-h-[200px]" key={participant.sid}>
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
              screen={"myscreen"}
            />
          )}
        </div>
      ) : null;
    });
  };

  const showSelfParticipantView = () => {
    return (
      <div className="max-h-[200px] max-w-[290px]">
        <Participant
          participant={localParticipant}
          isLocalParticipant={true}
          fromScreen="allOtherScreens"
        />
        {!allExcludedParticipant({
          identity: localParticipant.identity,
        }) && (
          <ParticipantsAnimationBar
            localParticipant={localParticipant}
            participant={localParticipant}
            screen={"myscreen"}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        zIndex: 10,
        position: "absolute",
        width: "110px",
        right: 85,
      }}
    >
      <Rnd
        style={{
          position: "static",
        }}
      >
        <>
          <div className="flex flex-col min-w-[190px] mt-[15px] ">
            {screenName !== "/myscreen"
              ? showSelfParticipantView()
              : screenName === "/myscreen" &&
                !isTutor({ identity: localParticipant.identity }) &&
                showSelfParticipantView()}
            {showTeacherView ? showViewWithTeacher() : showViewWithoutTeacher()}
          </div>
        </>
      </Rnd>
    </div>
  );
}
