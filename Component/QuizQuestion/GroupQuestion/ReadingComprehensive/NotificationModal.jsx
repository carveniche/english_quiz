import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import styles from "../../../outerPage.module.css"
export default function NotificationModal({ group_data, onClose,msg }) {
  
  const [open, setOpen] = useState(true);
  const handleClose = () => {
  typeof onClose==="function"&& onClose(true)
    setOpen(false);
    typeof window.hideReadingConferencingModalCb==="function"&&window.hideReadingConferencingModalCb()
  };

  return (
    <div className={styles.groupPage}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={styles.groupPage}

      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            maxHeight: "80%",
            height: "fit-content",
            overflow: "auto",
            p: 5,
            outline:0,
            borderRadius:'15px'
          }}
        >
          <h2>
          {msg ? msg : "Hey! You will get a passage now! Read it carefully and answer questions that follow."}
            
          </h2>
          <div
            style={{
           
              width: "fit-content",
              padding: 10,
              background: "#8C8CFB",
              borderRadius: 10,
              margin: "auto",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 24,
              transition: "background-color 0.8s, color 0.7s",
              color:"white",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5ED0F3 "; // Change background color on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#8C8CFB"; // Revert background color on hover out
             
            }}
            onClick={handleClose}
          >
            OK
          </div>
        </Box>
      </Modal>
    </div>
  );
}
