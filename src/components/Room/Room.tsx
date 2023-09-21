import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ScreenShareDraggable from "../DraggableComponent/ScreenShareDraggable";
import { useEffect } from "react";
import ChatWindow from "../ChatWindow/ChatWindow";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";
import FloatingParticipant from "../FloatingParticipant/FloatingParticipant";
import AllScreen from "../FeatureComponent/AllScreen/AllScreen";
import RemoteParticipantCountAndLessonDataEffect from "../RemoteCountAndLessonDataEffect/RemoteParticipantCountAndLessonDataEffect";

export default function Room() {
  const { room, toggleScreenShare, isSharingScreen } = useVideoContext();
  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
  );
  const screenShareState = useSelector(
    (state: RootState) => state.dataTrackStore.ShreenShareTracks
  );

  useEffect(() => {
    if (isSharingScreen) {
      console.log("returning from fn as isSharingScreen is already shared");
      return;
    } else {
      if (
        screenShareState.identity === room?.localParticipant.identity &&
        !isSharingScreen &&
        screenShareState.toggleFrom !== "CommonScreenShareButtonClicked"
      ) {
        console.log("inside else condition");
        toggleScreenShare();
      }
    }
  }, [screenShareState, isSharingScreen]);

  console.log("room component mouting");

  return (
    <>
      <>
        {screenShareState.identity !== room?.localParticipant.identity &&
          screenShareState.publishedState && <ScreenShareDraggable />}
        {currentSelectedScreen === "/allscreen" ? (
          <AllScreen />
        ) : (
          <div style={{ display: "block" }}>
            <FloatingParticipant screen={currentSelectedScreen} />
          </div>
        )}
      </>
      <RemoteParticipantCountAndLessonDataEffect />
      <ChatWindow />
      <BackgroundSelectionDialog />
    </>
  );
}
