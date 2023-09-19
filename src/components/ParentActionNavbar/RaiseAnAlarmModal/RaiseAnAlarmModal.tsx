import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { parentFeedbackApi } from "../../../api";
import { useState } from "react";
import ParentTakeScreenShotRaiseAlarm from "./ParentTakeScreenShotRaiseAlarm";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface RaiseAnAlarmModalProps {
  liveClassId: number;
  userId: number;
  student_id: number;
  handleClose: () => void;
}

export default function RaiseAnAlarmModal({
  liveClassId,
  userId,
  student_id,
  handleClose,
}: RaiseAnAlarmModalProps) {
  const [askFinalStayInClassModal, setShowAskFinalStayInClassModal] =
    useState(false);

  const [showScreenShotTakeModal, setShowScreenShotTakeModal] = useState(false);

  const takeScreenShot = () => {
    setShowScreenShotTakeModal(true);
  };

  const dontTakeScreenShot = () => {
    sendOnlyAlarmAlert();
    setShowAskFinalStayInClassModal(true);
  };

  const sendOnlyAlarmAlert = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", String(liveClassId));
    bodyFormData.append("user_id", String(userId));
    bodyFormData.append("student_id", String(student_id));
    bodyFormData.append("alarm", String(true));

    try {
      const response = await parentFeedbackApi(bodyFormData);

      if (response.data.status) {
        alert("Your Response has been Submitted");
        handleClose();
      } else {
        alert("Unable to send feedback at the moment, please try again later");
      }
    } catch (error) {
      console.error("An error occurred while sending feedback:", error);
    }
  };

  const stayInClass = () => {
    handleClose();
  };
  return (
    <>
      {showScreenShotTakeModal && (
        <ParentTakeScreenShotRaiseAlarm
          liveClassId={liveClassId}
          userId={userId}
          student_id={student_id}
        />
      )}
      {!askFinalStayInClassModal && !showScreenShotTakeModal ? (
        <div>
          <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex flex-col justify-center items-center">
                <p className="text-speedMathTextColor font-semibold text-lg text-center">
                  Would you like to take screenshot, then please click on yes
                  else no!
                </p>
              </div>

              <div className="flex justify-around flex-row items-center mt-5">
                <div>
                  <Button
                    onClick={takeScreenShot}
                    variant="contained"
                    color="primary"
                  >
                    Yes
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={dontTakeScreenShot}
                    variant="contained"
                    color="primary"
                  >
                    No
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      ) : !showScreenShotTakeModal ? (
        <div>
          <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex flex-col justify-center items-center">
                <p className="text-speedMathTextColor font-semibold text-lg text-center">
                  Thank you for the feedback, would you like to stay in class or
                  leave
                </p>
              </div>

              <div className="flex justify-around flex-row items-center mt-5">
                <div>
                  <Button
                    onClick={stayInClass}
                    variant="contained"
                    color="primary"
                  >
                    Stay in class
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => "// Call Leave class hear"}
                    variant="contained"
                    color="primary"
                  >
                    Leave
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
