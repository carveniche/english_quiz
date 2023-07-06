import { useState, useEffect } from "react";
import MediaErrorSnackbar from "./MediaErrorSnackbar/MediaErrorSnackbar";

import { useAppState } from "../../state";

import { useParams } from "react-router-dom";

import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

export default function JoiningScreen() {
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
    <div>
      <MediaErrorSnackbar error={mediaError} />
      <div>Hello, this is joining Screen</div>
    </div>
  );
}
