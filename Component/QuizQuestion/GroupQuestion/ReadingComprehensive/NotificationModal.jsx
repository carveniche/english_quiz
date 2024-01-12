import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
export default function NotificationModal({ group_data, onClose }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
  typeof onClose==="function"&& onClose(true)
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
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
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            maxHeight: "80%",
            height: "fit-content",
            overflow: "auto",
            p: 5,
          }}
        >
          <h2>
            Hey! You will get a passage now! Read it carefully and answer
            questions that follow.
          </h2>
          <div
            style={{
              border: "4px solid blue",
              width: "fit-content",
              padding: 10,
              background: "brown",
              borderRadius: 10,
              margin: "auto",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 24,
              transition: "background-color 0.8s, color 0.7s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#808000"; // Change background color on hover
              e.target.style.color = "black"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "brown"; // Revert background color on hover out
              e.target.style.color = "black"; // Revert text color on hover out
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
