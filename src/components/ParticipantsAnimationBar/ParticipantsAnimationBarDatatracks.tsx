import { useCallback } from "react";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useLocation } from "react-router";
export default function useParticipantsAnimationBarDatatracks(
  identity: string,
  key: string
) {
  const { room } = useVideoContext();

  const { pathname } = useLocation();

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
  }, []);
  return [handleKeyClick];
}
