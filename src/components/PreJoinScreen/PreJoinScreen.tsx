import { useState, useEffect } from "react";
import MediaErrorSnackbar from "./MediaErrorSnackbar/MediaErrorSnackbar";

import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import DeviceSelectionScreen from "./DeviceSelectionScreen/DeviceSelectionScreen";
import IntroContainer from "../IntroContainer/IntroContainer";

export default function PreJoinScreen() {
  //   const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    //Taking Audio Video Permission in this function and Setting Tracks

    if (!mediaError) {
      getAudioAndVideoTracks().catch((error) => {
        console.log("Error acquiring local Media");
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <DeviceSelectionScreen name={"Vipul"} />
    </IntroContainer>
  );
}
