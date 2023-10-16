import { useSelector } from "react-redux";
import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { finalRemoteParticipantCount } from "../../utils/common";
import LessonAndMathZoneEffect from "./LessonAndMathZoneEffect";
import RemoteParticipantCountEffect from "./RemoteParticipantCountEffect";
import { RootState } from "../../redux/store";
import ParticipantDeviceInformation from "../ParticipantDeviceInformation/ParticipantDeviceInformation";

export default function VitalDataHandler() {
  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const speakerViewParticipants = useSpeakerViewParticipants();

  const remotePCount = finalRemoteParticipantCount(speakerViewParticipants);

  return (
    <div>
      <RemoteParticipantCountEffect remotePCount={remotePCount} />
      <LessonAndMathZoneEffect liveClassId={liveClassId} />
      <ParticipantDeviceInformation
        remotePCount={remotePCount}
        liveClassId={liveClassId}
        userId={userId}
      />
    </div>
  );
}
