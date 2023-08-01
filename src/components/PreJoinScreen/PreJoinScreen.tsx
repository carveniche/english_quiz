import { useState, useEffect } from "react";
import MediaErrorSnackbar from "./MediaErrorSnackbar/MediaErrorSnackbar";

import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import DeviceSelectionScreen from "./DeviceSelectionScreen/DeviceSelectionScreen";
import IntroContainer from "../IntroContainer/IntroContainer";
import { useDispatch } from "react-redux";
import {
  addUserId,
  addLiveClassId,
} from "../../redux/features/liveClassDetails";

export default function PreJoinScreen() {
  //   const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();

  const dispatch = useDispatch();

  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let userID = Number(params.get("userID"));
    let liveClassID = Number(params.get("liveClassID"));
    if (!isNaN(userID) && !isNaN(liveClassID)) {
      dispatch(addLiveClassId(liveClassID));
      dispatch(addUserId(userID));
    }
  }, []);

  useEffect(() => {
    //Taking Audio Video Permission in this function and Setting Tracks

    if (!mediaError) {
      getAudioAndVideoTracks().catch((error) => {
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <DeviceSelectionScreen name="" />
    </IntroContainer>
  );
}
