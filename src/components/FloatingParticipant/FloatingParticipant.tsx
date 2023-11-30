import React from "react";
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
import Draggable from "react-draggable";
import { ROUTERKEYCONST } from "../../constants";

interface FloatingParticipantProps {
  screen: any;
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function FloatingParticipant({
  screen,
  parentRef,
}: FloatingParticipantProps) {
  const [screenName, setScreenName] = useState("");

  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  useEffect(() => {
    if (screen) {
      setScreenName(screen);
    }
  }, [screen]);

  const calculateYPosition = (index: number, identity?: any) => {
    if (
      parentRef.current?.offsetHeight -
        index *
          (isTutor({ identity: identity }) ||
          (isTutor({ identity: localParticipant.identity }) &&
            screenName !== ROUTERKEYCONST.myScreen)
            ? 200
            : 220) <
      0
    ) {
      return 0;
    } else {
      return (
        parentRef.current?.offsetHeight -
        index *
          ((isTutor({ identity: identity }) ||
            isTutor({ identity: localParticipant.identity })) &&
          screenName !== ROUTERKEYCONST.myScreen
            ? 200
            : 220)
      );
    }
  };

  const commonMappingAllParticipants = () => {
    let finalParticipants = speakerViewParticipants;
    if (screenName === ROUTERKEYCONST.myScreen) {
      finalParticipants = speakerViewParticipants.filter((participant) => {
        console.log("asa", isTutor({ identity: participant.identity }));
        if (isTutor({ identity: participant.identity })) {
          return false;
        }
        return true;
      });
    }

    finalParticipants.sort((a, b) => {
      if (isTutor({ identity: a.identity })) {
        return 1;
      } else if (isTutor({ identity: b.identity })) {
        return -1;
      } else {
        return 0;
      }
    });

    return (
      <React.Fragment key={finalParticipants.length + screenName}>
        {screenName === ROUTERKEYCONST.myScreen &&
        isTutor({ identity: localParticipant.identity }) ? null : (
          <Draggable
            key={`localParticipant${1}`}
            defaultPosition={{
              x: parentRef.current?.clientWidth - 200,
              y: calculateYPosition(1, localParticipant.identity),
            }}
            offsetParent={parentRef.current}
            bounds={{
              left: 0,
              right: parentRef.current?.clientWidth - 200,
              top: 0,
              bottom: calculateYPosition(1, localParticipant.identity),
            }}
          >
            <div className="z-10 absolute  max-h-full cursor-pointer ">
              <div className="relative max-h-[225px] max-w-[290px]">
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
            </div>
          </Draggable>
        )}

        {finalParticipants.map((participant, index) => {
          return excludeParticipantTechSmParent.includes(
            participant.identity
          ) ? (
            <React.Fragment key={participant.sid}>
              <Participant
                key={participant.sid}
                participant={participant}
                fromScreen="allOtherScreens"
                remoteParticipantIdentity={participant.identity}
              />
            </React.Fragment>
          ) : (
            <Draggable
              key={participant.sid}
              defaultPosition={{
                x: parentRef.current?.clientWidth - 200,
                y:
                  screenName === ROUTERKEYCONST.myScreen &&
                  isTutor({ identity: localParticipant.identity })
                    ? calculateYPosition(index + 1, participant.identity)
                    : calculateYPosition(index + 2, participant.identity),
              }}
              offsetParent={parentRef.current}
              bounds={{
                left: 0,
                right: parentRef.current?.clientWidth - 200,
                top: 0,
                bottom:
                  screenName === ROUTERKEYCONST.myScreen &&
                  !isTutor({ identity: localParticipant.identity })
                    ? calculateYPosition(1, participant.identity)
                    : calculateYPosition(1, participant.identity),
              }}
            >
              <div className="z-10 absolute  max-h-full cursor-pointer">
                <div
                  className="relative max-h-[225px] max-w-[290px]"
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
              </div>
            </Draggable>
          );
        })}
      </React.Fragment>
    );
  };

  return <>{commonMappingAllParticipants()}</>;
}
