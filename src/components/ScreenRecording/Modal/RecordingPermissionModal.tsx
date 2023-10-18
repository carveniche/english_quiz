import { Box, Button, Modal } from "@mui/material";
import React from "react";

export default function RecordingPermissionModal({
  showteacherRecordingPopup,
  setShowTeacherRecordingPopUp,
  recordingSlogan,
  startRecording,
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
    minHeight: 100,
    borderRadius: 5,
  };
  return (
    <>
      {" "}
      <Modal
        open={showteacherRecordingPopup}
        //onHide={() => setShowTeacherRecordingPopUp(false)}
      >
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4">
              <div>
                {recordingSlogan ? (
                  <h3
                    style={{
                      fontSize: 22,
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    We need the Recording Permission to Continue the Session,
                    Please give Screen Share Permission to Start Recording
                  </h3>
                ) : (
                  <h3
                    style={{
                      color: "#233584",
                      fontSize: 28,
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    Please start the recording
                  </h3>
                )}
              </div>
              <Button
                //onClick={() => setShowTeacherRecordingPopUp(false)}
                variant="contained"
                onClick={() => startRecording()}
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
