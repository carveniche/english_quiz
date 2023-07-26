import { useCallback } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { addAnimationDatatrack } from "../../redux/features/dataTrackStore";
export default function useParticipantsAnimationBarDatatracks() {
  const { room } = useVideoContext();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleKeyClick = useCallback((identity: string, key: string) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let json = {
      pathName: pathname,
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
  }, []);
  return [handleKeyClick];
}
