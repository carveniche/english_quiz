import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addRemoteParticipantCount } from "../../redux/features/liveClassDetails";

interface remotePCountInterface {
  remotePCount: number;
}

function RemoteParticipantCountEffect({ remotePCount }: remotePCountInterface) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addRemoteParticipantCount(remotePCount));
  }, [remotePCount]);

  return null;
}

export default RemoteParticipantCountEffect;
