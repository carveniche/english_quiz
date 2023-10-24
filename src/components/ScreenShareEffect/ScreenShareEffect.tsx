import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useEffect } from "react";
import ScreenShareDraggable from "../DraggableComponent/ScreenShareDraggable";

import { iPadDevice, isIpadDeviceChrome } from "../../utils/devices";
export default function ScreenShareEffect() {
  const { room, toggleScreenShare, isSharingScreen } = useVideoContext();

  const screenShareState = useSelector(
    (state: RootState) => state.dataTrackStore.ShreenShareTracks
  );

  useEffect(() => {
    if (iPadDevice || isIpadDeviceChrome) {
      return;
    }

    if (
      isSharingScreen &&
      screenShareState.toggleFrom !== "RequestingScreenShare"
    ) {
      return;
    } else {
      if (
        screenShareState.identity === room?.localParticipant.identity &&
        screenShareState.toggleFrom !== "CommonScreenShareButtonClicked"
      ) {
        toggleScreenShare("");
      }
    }
  }, [screenShareState, isSharingScreen]);

  return (
    <>
      {screenShareState.identity !== room?.localParticipant.identity &&
        screenShareState.publishedState && <ScreenShareDraggable />}
    </>
  );
}
