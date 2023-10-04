import { Box, Button, Modal, Stack } from "@mui/material";
import React from "react";

export default function SkippedQuestionModal({
  checkSkippedQuestion,
}: {
  checkSkippedQuestion: Function;
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
      <Modal
        open={true}
        //onHide={() => setShowTeacherRecordingPopUp(false)}
      >
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4">
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  You Want to Review Your Skipped Questions?
                </h3>
              </div>
              <Stack
                direction={"row"}
                style={{ width: "fit-content", margin: "auto" }}
                gap={4}
              >
                <Button
                  //onClick={() => setShowTeacherRecordingPopUp(false)}
                  variant="contained"
                  style={{
                    margin: "auto",
                    display: "block",
                    marginTop: "1rem",
                  }}
                  onClick={() => checkSkippedQuestion(true)}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  style={{
                    margin: "auto",
                    display: "block",
                    marginTop: "1rem",
                  }}
                  color="error"
                  onClick={() => checkSkippedQuestion(false)}
                >
                  No
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
}
