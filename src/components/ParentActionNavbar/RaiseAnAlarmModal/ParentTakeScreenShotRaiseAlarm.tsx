import { useEffect, useRef } from "react";
import { parentFeedbackApi } from "../../../api";

interface ParentTakeScreenShotAlarmProps {
  liveClassId: number;
  userId: number;
  student_id: number;
}

export default function ParentTakeScreenShotAlarm({
  liveClassId,
  userId,
  student_id,
}: ParentTakeScreenShotAlarmProps) {
  const canvasRefParent = useRef(null);

  useEffect(() => {
    reportErrorSS();
  }, []);

  const reportErrorSS = () => {
    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        // Grab frame from stream
        captureScreenShot(stream);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const captureScreenShot = (stream: MediaStream) => {
    let canvasCapture = canvasRefParent.current;

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
    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", String(liveClassId));
    bodyFormData.append("user_id", String(userId));
    bodyFormData.append("student_id", String(student_id));
    bodyFormData.append("alarm", String(true));
    bodyFormData.append("screenshot", blob, "image.png");

    try {
      const response = await parentFeedbackApi(bodyFormData);

      if (response.data.status) {
        alert("Your Response has been Submitted");
      } else {
        alert("Unable to send feedback at the moment, please try again later");
      }
    } catch (error) {
      console.error("An error occurred while sending feedback:", error);
    }
  };
  return (
    <>
      <canvas ref={canvasRefParent} style={{ display: "none" }} />
    </>
  );
}
