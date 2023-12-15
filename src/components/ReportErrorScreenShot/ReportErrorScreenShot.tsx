import { useRef, useState } from "react";
import ReportErrorLogo from "../Navbar/NavbarIcons/ReportErrorLogo";

import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { createLiveClassTicket } from "../../api";
import { Tooltip } from "@material-ui/core";
import CustomAlert from "../DisplayCustomAlert/CustomAlert";
import { isSafariBrowser } from "../../utils/devices";

export default function ReportErrorScreenShot() {
  const [openAlertBox, setOpenAlertBox] = useState(true);
  const [screenShotProgress, setScreenShotProgress] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertWarningType, setAlertWarningType] = useState<
    "info" | "error" | "warning" | undefined
  >("info");

  const { userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const {
    activeTabArray,
    currentSelectedKey,
    currentSelectedIndex,
    currentSelectedRouter,
  } = useSelector((state: RootState) => state.activeTabReducer);

  const selectedTab = activeTabArray[currentSelectedIndex];
  const { extraParams } = selectedTab || {};
  const { tagId, videoTagId } = extraParams || [];

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
      case "whiteboard":
        screenName = "Whiteboard";
        break;
      case "/lesson":
        screenName = "Lesson PDF";
        break;
      case "/mathvideolesson":
        screenName = "Lesson Video";
        break;
      case "/mathzone":
        screenName = "Quiz";
        break;
      case "/speedmath":
        screenName = "Speed Math";
        break;
      case "/coding":
        screenName = "Coding";
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
      .getDisplayMedia({
        video: {
          displaySurface: "monitor",
        },
      })
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

  const reportErrorSafari = () => {
    if (screenShotProgress) {
      return;
    }

    setScreenShotProgress(true);
    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        captureScreenShotSafari(stream);
      })
      .catch((err) => {
        console.log("err", err);
        setScreenShotProgress(false);
      });
  };

  const captureScreenShotSafari = (stream) => {
    const videoElement = document.createElement("video");
    document.body.appendChild(videoElement);

    videoElement.srcObject = stream;

    videoElement.onloadedmetadata = async () => {
      const canvasCapture = canvas.current;
      canvasCapture.width = videoElement.videoWidth;
      canvasCapture.height = videoElement.videoHeight;

      const context = canvasCapture.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        canvasCapture.width,
        canvasCapture.height
      );

      const blob = await new Promise((resolve) =>
        canvasCapture.toBlob(resolve)
      );

      uploadScreenShotToServer(blob);

      document.body.removeChild(videoElement);
    };
  };

  const extractSubConceptAndExerciseIdMathZone = () => {
    let value = String(currentSelectedRouter);

    const parts = value.split("/");

    // Extract the values from the appropriate positions
    const subConceptId = parts[2] || null;
    const exerciseId = parts[3] || null;
    let exercise_id;

    if (exerciseId === "pre_test" || exerciseId === "post_test") {
      exercise_id = subConceptId;
    } else {
      exercise_id = exerciseId;
    }

    return { subConceptId, exercise_id };
  };

  const uploadScreenShotToServer = async (blob: Blob) => {
    let screenName = getCurrentScreenName(String(currentSelectedKey));
    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", String(liveClassId));
    bodyFormData.append("user_id", String(userId));
    bodyFormData.append("screenshot", blob, "image.png");

    if (screenName === "Lesson PDF") {
      bodyFormData.append("concept_resource_id", tagId);
      bodyFormData.append("from_page", screenName);
    } else if (screenName === "Lesson Video") {
      bodyFormData.append("sub_concept_video_id", videoTagId);
      bodyFormData.append("from_page", screenName);
    } else if (screenName === "Quiz") {
      const { subConceptId, exercise_id } =
        extractSubConceptAndExerciseIdMathZone();

      bodyFormData.append("sub_concept_id", String(subConceptId));
      bodyFormData.append("exercise_id", String(exercise_id));
      bodyFormData.append("from_page", screenName);
    } else {
      bodyFormData.append("from_page", screenName);
    }

    try {
      const response = await createLiveClassTicket(bodyFormData);

      if (response.data.status) {
        setAlertMessage(
          "Your error report has been submitted to the beGalileo team."
        );
        setOpenAlertBox(true);
      } else {
        setAlertMessage(
          "Unable to send screen shot : " +
            response.data.message +
            " Please try again"
        );
        setAlertWarningType("error");
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
        <button
          onClick={() =>
            isSafariBrowser ? reportErrorSafari() : reportErrorSS()
          }
        >
          <div className="flex justify-center items-center min-w-[35px] p-1  rounded-full gap-2 bg-header-black hover:bg-black">
            <ReportErrorLogo />
          </div>
        </button>
      </Tooltip>

      {alertMessage !== "" && (
        <CustomAlert
          variant={alertWarningType}
          headline={alertMessage}
          open={openAlertBox}
          handleClose={() => setOpenAlertBox(false)}
        />
      )}
    </>
  );
}
