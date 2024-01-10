import { Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
import ListeningPlayer from "./ListeningPlayer";
import CloseIcon from "@mui/icons-material/Close";
export default function ListeningModal({ group_data, onClick, from ,autoPlay}) {
  const handleClose = () => {
    typeof onClick === "function" && onClick();
  };
  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "80%",
            width: 600,
            overflow: "auto",
            position: "absolute",
            outline: 0,
          }}
        >
          {from === "non_preview" && (
            <div
              style={{
                width: "calc(100% - 64px)",
              }}
            >
              <div style={{ marginBottom: 5, float: "right", width: "200px" }}>
                <Button
                  variant="contained"
                  style={{ width: "100%", background: "orange" }}
                  onClick={handleClose}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          <Box
            sx={{
              width: "calc(100% - 64px)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              height: "fit-content",
              clear: "both",
              borderRadius: 1,
              position: "relative",
            }}
          >
            {from === "preview" && (
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseIcon />
              </IconButton>
            )}
           {group_data?.question_text?.length>0&& <div
              className={styles.questionName}
              style={{ clear: "both", marginBottom: 8 }}
            >
              {group_data?.question_text.map((item, key) => (
                <React.Fragment key={key}>
                  {objectParser(item, key)}
                </React.Fragment>
              ))}
            </div>}
            <ListeningPlayer audioUrl={group_data?.resources[0]?.url} autoPlay={autoPlay}/>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
