import { useEffect, useState } from "react";
import { RemoteParticipant } from "twilio-video";
import useVideoContext from "../useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import {
  addParentJoinedClass,
  addTechJoinedClass,
  setScreenSharePermission,
  setScreenShareStatus,
} from "../../redux/features/liveClassDetails";
import { isParent, isTech } from "../../utils/participantIdentity";
import { allExcludedParticipants } from "../../utils/excludeParticipant";

/**
 * This hook returns an array of the video room's participants. Unlike the hooks
 * "useSpeakerViewParticipants" and "useGalleryViewParticipants", this hook does not reorder
 * the list of participants whenever the dominantSpeaker changes. This will prevent unnecessary
 * re-renders because components that use this hook will only update when a participant connects
 * to or disconnects from the room.
 */

export default function useParticipants() {
  const { room } = useVideoContext();
  const [participants, setParticipants] = useState(
    Array.from(room?.participants.values() ?? [])
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (room) {
      const participantConnected = (participant: RemoteParticipant) => {
        if (isTech({ identity: participant.identity })) {
          dispatch(addTechJoinedClass(true));
        }

        if (isParent({ identity: participant.identity })) {
          dispatch(addParentJoinedClass(true));
        }

        setParticipants((prevParticipants) => [
          ...prevParticipants,
          participant,
        ]);
      };

      const participantDisconnected = (participant: RemoteParticipant) => {
        if (isTech({ identity: participant.identity })) {
          dispatch(addTechJoinedClass(false));
        }

        if (isParent({ identity: participant.identity })) {
          dispatch(addParentJoinedClass(false));
        }

        if (!allExcludedParticipants.includes(participant.identity)) {
          dispatch(
            setScreenSharePermission({
              status: false,
              identity: participant.identity,
            })
          );
          dispatch(setScreenShareStatus(false));
        }

        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p !== participant)
        );
      };

      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      return () => {
        room.off("participantConnected", participantConnected);
        room.off("participantDisconnected", participantDisconnected);
      };
    }
  }, [room]);

  return participants;
}
