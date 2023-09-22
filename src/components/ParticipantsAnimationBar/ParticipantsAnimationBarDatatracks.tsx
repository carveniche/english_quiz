import { useCallback } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { addAnimationDatatrack } from "../../redux/features/dataTrackStore";
export default function useParticipantsAnimationBarDatatracks() {
  const { room } = useVideoContext();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleKeyClick = useCallback(
    (identity: string, key: string, state?: boolean) => {
      const [localDataTrackPublication] = [
        ...room.localParticipant.dataTracks.values(),
      ];

      if (key === "ScreenShare") {
        let DataTrackObj = {
          pathName: null,
          value: {
            datatrackName: "ScreenShare",
            publishedState: state,
            identity: identity,
            toggleFrom: "RequestingScreenShare",
          },
        };

        localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      } else {
        let json = {
          pathName: pathname === "/" ? null : pathname,
          value: {
            datatrackName: "Animations",
            type: key,
            identity: identity,
          },
        };
        localDataTrackPublication.track.send(JSON.stringify(json));

        dispatch(
          addAnimationDatatrack({
            datatrackName: "Animations",
            type: key,
            identity: identity,
          })
        );
      }
    },
    []
  );
  return [handleKeyClick];
}
