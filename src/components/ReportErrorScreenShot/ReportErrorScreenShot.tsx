import { useRef, useState } from "react";
import ReportErrorLogo from "../Navbar/NavbarIcons/ReportErrorLogo";
import { getQueryParamsDetails } from "../../utils/getQueryParams";

export default function ReportErrorScreenShot() {
  const [screenShotProgress, setScreenShotProgress] = useState(false);

  const canvas = useRef(null);

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

  const uploadScreenShotToServer = (blob: Blob) => {
    const params = getQueryParamsDetails();
    const paramsObj = Object.fromEntries(params.entries());

    const { liveClassID, userID } = paramsObj;

    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", liveClassID);
    bodyFormData.append("user_id", userID);
    bodyFormData.append("screenshot", blob, "image.png");

    setScreenShotProgress(false);
  };

  return (
    <>
      <canvas ref={canvas} style={{ display: "none" }} />
      <button onClick={() => reportErrorSS()}>
        <ReportErrorLogo />
      </button>
    </>
  );
}
