import React from "react";
import screenPermissionImage from "../../../assets/screenPermission.jpg";
import { Box, Button, Modal } from "@mui/material";
export default function RecordingStepModal({
  recordingStepsModal,
  startRecording,
  setShowTeacherRecordingPopUp,
}) {
  const style = {
    width: "fit-content",
    maxWidth: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    minWidth: 100,
    height: "fit-content",
    margin: "10px auto",
    minHeight: 300,
    borderRadius: 5,
  };
  return (
    <>
      <Modal
        open={recordingStepsModal}
        //onHide={() => setShowTeacherRecordingPopUp(false)}
      >
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4 ">
              <div>
                <h4
                  style={{
                    color: "#233584",
                    fontSize: 28,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                  className="text-center"
                >
                  We need Audio Permission as well to capture screen Recording,
                  Please follow the steps mentioned below to give Audio
                  Permission
                </h4>
              </div>

              <div className="text-center">
                <img
                  style={{ width: "500px", height: "420px" }}
                  src={screenPermissionImage}
                />
              </div>

              <Button
                //onClick={() => setShowTeacherRecordingPopUp(false)}
                onClick={() => startRecording()}
                variant="contained"
                style={{ margin: "auto", display: "block", marginTop: "1rem" }}
              >
                Okay
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
}
