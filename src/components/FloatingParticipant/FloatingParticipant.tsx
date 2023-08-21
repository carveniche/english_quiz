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

export default function FloatingParticipant(screen: any) {
  const [screenName, setScreenName] = useState("");
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const speakerViewParticipants = useSpeakerViewParticipants();

  useEffect(() => {
    if (screen) {
      setScreenName(screen.screen);
    }
  }, []);

  return (
    <div
      style={{
        zIndex: 10,
      }}
    >
      <Rnd
        style={{
          position: "static",
        }}
      >
        {screenName === "/myscreen" ? (
          <>
            <div className="flex flex-col border border-black min-w-[190px] mt-[15px] ">
              {!isTutor({ identity: localParticipant.identity }) && (
                <div className="max-h-[200px] max-w-[290px]">
                  <Participant
                    participant={localParticipant}
                    isLocalParticipant={true}
                    fromScreen={"allOtherScreens"}
                  />
                  {!allExcludedParticipant({
                    identity: localParticipant.identity,
                  }) && (
                    <ParticipantsAnimationBar
                      localParticipant={localParticipant}
                      participant={localParticipant}
                      screen={"myScreen"}
                    />
                  )}
                </div>
              )}
              {speakerViewParticipants.map((participant) => {
                return (
                  participant.identity !== "tutor" && (
                    <div className="max-h-[200px]" key={participant.sid}>
                      <Participant
                        key={participant.sid}
                        participant={participant}
                        fromScreen={"allOtherScreens"}
                      />
                      {!allExcludedParticipant({
                        identity: participant.identity,
                      }) && (
                        <ParticipantsAnimationBar
                          localParticipant={localParticipant}
                          participant={participant}
                          screen={"myScreen"}
                        />
                      )}
                    </div>
                  )
                );
              })}
            </div>
          </>
        ) : (
          <div></div>
        )}
      </Rnd>
    </div>
  );
}
