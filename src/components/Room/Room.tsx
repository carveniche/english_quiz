import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChatWindow from "../ChatWindow/ChatWindow";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";
import FloatingParticipant from "../FloatingParticipant/FloatingParticipant";
import AllScreen from "../FeatureComponent/AllScreen/AllScreen";
import RemoteParticipantCountAndLessonDataEffect from "../RemoteCountAndLessonDataEffect/RemoteParticipantCountAndLessonDataEffect";
import ScreenShareEffect from "../ScreenShareEffect/ScreenShareEffect";

interface RoomProps {
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function Room({ parentRef }: RoomProps) {
  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
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
        <FloatingParticipant
          screen={currentSelectedScreen}
          parentRef={parentRef}
        />
      )}

      {/* 
        This RemoteParticipantCountAndLessonDataEffect component will dispatch remoteParticipant count and lessons data in redux store .
      */}
      <RemoteParticipantCountAndLessonDataEffect />
      {/* 
        This ChatWindow will handle all chat flow in application .
      */}
      <ChatWindow />
      {/* 
        This BackgroundSelectionDialog will handle background change feature.
      */}
      <BackgroundSelectionDialog />
    </>
  );
}
