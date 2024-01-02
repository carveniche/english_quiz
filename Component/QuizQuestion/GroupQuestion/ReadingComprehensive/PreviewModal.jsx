import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
import CloseIcon from "@mui/icons-material/Close";
export default function PreviewModal({ group_data, onClick }) {
  const handleClose = () => {
    typeof onClick === "function" && onClick();
  };
  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            maxHeight: "80%",
            height: "fit-content",
            overflow: "auto",
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
          {group_data.map((passage, key) => (
            <div key={key} style={{ marginTop: 10 }}>
              <div className={styles.questionName}>
                {passage.map((item, key) => objectParser(item, key))}
              </div>
            </div>
          ))}
        </Box>
      </Modal>
    </div>
  );
}
