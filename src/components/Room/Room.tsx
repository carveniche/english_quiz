import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChatWindow from "../ChatWindow/ChatWindow";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";
import FloatingParticipant from "../FloatingParticipant/FloatingParticipant";
import AllScreen from "../FeatureComponent/AllScreen/AllScreen";
import ScreenShareEffect from "../ScreenShareEffect/ScreenShareEffect";
import VitalDataHandler from "../RemoteCountAndLessonDataEffect/VitalDataHandler";
import ShowDeviceInfoModalTech from "../ShowDeviceInfoModalTech/ShowDeviceInfoModalTech";
import { isTech } from "../../utils/participantIdentity";

interface RoomProps {
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function Room({ parentRef }: RoomProps) {
  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
  );

  const { showDeviceInfoModalTech } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  console.log("room component mouting");

  return (
    <>
      {/* 
        This ScreenShareEffect component will handle all screenShare request and toggleOn toggleOff ScreenShare for LocalParticipant and RemoteParticipant.
      */}
      <ScreenShareEffect />

      {currentSelectedScreen === "/allscreen" ? (
        <AllScreen />
      ) : (
        <div style={{ display: "block" }}>
          <FloatingParticipant
            screen={currentSelectedScreen}
            parentRef={parentRef}
          />
        </div>
      )}

      {/* 
        This VitalDataHandler component will dispatch remoteParticipant count and lessons data in and also call device information api redux store .
      */}
      <VitalDataHandler />
      {/* 
        This ChatWindow will handle all chat flow in application .
      */}
      <ChatWindow />
      {/* 
        This BackgroundSelectionDialog will handle background change feature.
      */}
      <BackgroundSelectionDialog />

      {/* 
        This Component Will Show All Participant Device Info to Tech Support.
      */}
      {showDeviceInfoModalTech && isTech({ identity: String(role_name) }) && (
        <ShowDeviceInfoModalTech />
      )}
    </>
  );
}
