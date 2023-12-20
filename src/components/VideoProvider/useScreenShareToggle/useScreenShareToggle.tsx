import { useState, useCallback, useRef } from "react";
import { LogLevels, Track, Room } from "twilio-video";
import { ErrorCallback } from "../../../types";

import { isSafariBrowser } from "../../../utils/devices";

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

import { useDispatch } from "react-redux";

import { addScreenShareDatatrack } from "../../../redux/features/dataTrackStore";
import { setSafariModalForScreenShare } from "../../../redux/features/liveClassDetails";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { submitErrorLog } from "../../../api";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

export default function useScreenShareToggle(
  room: Room | null,
  onError: ErrorCallback
) {
  const [isSharing, setIsSharing] = useState(false);
  const { userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const stopScreenShareRef = useRef<() => void>(null!);
  const alreadyGetScreenShareRequestRef = useRef<boolean | undefined>(false);
  const dispatch = useDispatch();

  const sendScreenShareDatatrack = (state: boolean) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: null,
      value: {
        datatrackName: "ScreenShare",
        publishedState: state,
        identity: room?.localParticipant.identity,
        toggleFrom: "CommonScreenShareButtonClicked",
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));

    dispatch(
      addScreenShareDatatrack({
        publishedState: state,
        identity: room?.localParticipant.identity,
        toggleFrom: "CommonScreenShareButtonClicked",
      })
    );
  };

  const handlePermissionDeniedDataTrack = (value: boolean) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: null,
      value: {
        datatrackName: "ScreenSharePermissionDenied",
        status: value,
        identity: room?.localParticipant.identity,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const callApiWhenStudentScreenShareStopped = () => {
    if (!isTutorTechBoth({ identity: room?.localParticipant.identity || "" })) {
      let errorName = "Student screen share stopped";
      submitErrorLog(userId, liveClassId, errorName, 0, 0);
    }
  };

  const shareScreen = useCallback(() => {
    if (alreadyGetScreenShareRequestRef.current) {
      return;
    }

    alreadyGetScreenShareRequestRef.current = true;
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          displaySurface: "monitor",
        },
      })
      .then((stream) => {
        const track = stream.getTracks()[0];

        // All video tracks are published with 'low' priority. This works because the video
        // track that is displayed in the 'MainParticipant' component will have it's priority
        // set to 'high' via track.setPriority()
        room!.localParticipant
          .publishTrack(track, {
            name: "screen", // Tracks can be named to easily find them later
            priority: "low", // Priority is set to high by the subscriber when the video track is rendered
          } as MediaStreamTrackPublishOptions)

          .then((trackPublication) => {
            stopScreenShareRef.current = () => {
              room!.localParticipant.unpublishTrack(track);
              // TODO: remove this if the SDK is updated to emit this event
              room!.localParticipant.emit("trackUnpublished", trackPublication);
              track.stop();
              setIsSharing(false);
              sendScreenShareDatatrack(false);
              alreadyGetScreenShareRequestRef.current = false;
              handlePermissionDeniedDataTrack(true);
              callApiWhenStudentScreenShareStopped();
            };

            track.onended = stopScreenShareRef.current;
            setIsSharing(true);
            sendScreenShareDatatrack(true);
            handlePermissionDeniedDataTrack(false);
          })
          .catch(onError);
      })
      .catch((error) => {
        alreadyGetScreenShareRequestRef.current = false;
        handlePermissionDeniedDataTrack(true);
        // Don't display an error if the user closes the screen share dialog
        if (
          error.message === "Permission denied by system" ||
          (error.name !== "AbortError" && error.name !== "NotAllowedError")
        ) {
          console.error(error);
          onError(error);
        }
      });
  }, [room, onError]);

  const toggleScreenShare = useCallback(
    (from: string | undefined) => {
      if (room) {
        if (isSharing) {
          stopScreenShareRef.current();
        } else {
          if (from === "usergesture") {
            dispatch(setSafariModalForScreenShare(false));
            shareScreen();
          } else {
            if (isSafariBrowser) {
              dispatch(setSafariModalForScreenShare(true));
            } else {
              shareScreen();
            }
          }
        }
      }
    },
    [isSharing, shareScreen, room]
  );

  return [isSharing, toggleScreenShare] as const;
}
