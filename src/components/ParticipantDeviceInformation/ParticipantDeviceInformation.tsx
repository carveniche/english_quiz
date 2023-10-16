import { useEffect } from "react";
import { getDeviceInfoForTech } from "../../api";
import { useDispatch } from "react-redux";
import { updateParticipantDeviceInformation } from "../../redux/features/liveClassDetails";

interface ParticipantDeviceInformationProps {
  remotePCount: number;
  liveClassId: number;
  userId: number;
}

export default function ParticipantDeviceInformation({
  remotePCount,
  liveClassId,
  userId,
}: ParticipantDeviceInformationProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    getDeviceInfoForTech(liveClassId, 47804) // For now userId is hardcoded its need to change once api changes are done from backend
      .then((res) => {
        if (res.data.status) {
          dispatch(updateParticipantDeviceInformation(res?.data?.device_data));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [remotePCount]);
  return null;
}
