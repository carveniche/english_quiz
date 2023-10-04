import { useRef, useState } from "react";
import ReportErrorLogo from "../Navbar/NavbarIcons/ReportErrorLogo";

import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { createLiveClassTicket } from "../../api";
import { Tooltip } from "@material-ui/core";

export default function ReportErrorScreenShot() {
  const [screenShotProgress, setScreenShotProgress] = useState(false);

  const { userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
  );

  const canvas = useRef(null);

  const getCurrentScreenName = (path: string) => {
    let screenName = "";

    switch (path) {
      case "/allscreen":
        screenName = "All Screen";
        break;
      case "/myscreen":
        screenName = "My Screen";
        break;
      case "/speedmath":
        screenName = "Speed Math";
        break;
    }

    return screenName;
  };

  const reportErrorSS = () => {
    if (screenShotProgress) {
      return;
    }

    setScreenShotProgress(true);

    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        // Grab frame from stream
        captureScreenShot(stream);
      })
      .catch(() => setScreenShotProgress(false));
  };

  const captureScreenShot = (stream: MediaStream) => {
    let canvasCapture = canvas.current;

    setTimeout(() => {
      let track = stream.getVideoTracks()[0];
      let capture = new ImageCapture(track);

      capture.grabFrame().then((bitmap: ImageBitmap) => {
        canvasCapture.width = bitmap.width;
        canvasCapture.height = bitmap.height;

        canvasCapture.getContext("2d").drawImage(bitmap, 0, 0);

        track.stop();

        canvasCapture.toBlob((blob: Blob) => {
          uploadScreenShotToServer(blob);
        });
      });
    }, 500);
  };

  const uploadScreenShotToServer = async (blob: Blob) => {
    let screenName = getCurrentScreenName(String(currentSelectedScreen));
    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", String(liveClassId));
    bodyFormData.append("user_id", String(userId));
    bodyFormData.append("screenshot", blob, "image.png");
    bodyFormData.append("from_page", screenName);

    try {
      const response = await createLiveClassTicket(bodyFormData);

      if (response.data.status) {
        alert("Your error has been reported");
      } else {
        alert(
          "Unable to send screen shot : " +
            response.data.message +
            " Please try again"
        );
      }
    } catch (error) {
      console.error("An error occurred while sending feedback:", error);
    }

    setScreenShotProgress(false);
  };

  return (
    <>
      <canvas ref={canvas} style={{ display: "none" }} />
      <Tooltip title="Take ScreenShot and Submit Error" arrow>
        <button onClick={() => reportErrorSS()}>
          <ReportErrorLogo />
        </button>
      </Tooltip>
    </>
  );
}
