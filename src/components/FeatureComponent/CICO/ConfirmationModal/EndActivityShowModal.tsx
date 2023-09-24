import { Box, Button, Modal, Stack } from "@mui/material";
import React from "react";

export default function EndActivityShowModal({ handleComplete, handleClose }) {
  const style = {
    width: "fit-content",
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
      <Modal open={true}>
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4 ">
              <div>
                <h3
                  style={{
                    color: "red",
                    fontSize: 28,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  Do you want to complete the activity?
                </h3>
              </div>
              <hr />
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                spacing={8}
                width={"fit-content"}
                margin={"auto"}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleComplete}
                >
                  Yes : Complete Now
                </Button>

                <Button variant="contained" onClick={handleClose}>
                  {" "}
                  No : Close
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
}
