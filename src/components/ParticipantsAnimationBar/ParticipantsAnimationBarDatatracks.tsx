import { useCallback } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import {
  addDataTrackValue,
  addAnimationTrackIdentity,
} from "../../redux/features/dataTrackStore";
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
        type: key,
        identity: identity,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(json));

    dispatch(
      addDataTrackValue({
        type: key,
        identity: identity,
      })
    );
  }, []);
  return [handleKeyClick];
}
