import { useRef, useState } from "react";
import ReportErrorLogo from "../Navbar/NavbarIcons/ReportErrorLogo";

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
          // Do things with blob here
          console.log("output blob:", blob);
          setScreenShotProgress(false);
        });
      });
    }, 500);
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
