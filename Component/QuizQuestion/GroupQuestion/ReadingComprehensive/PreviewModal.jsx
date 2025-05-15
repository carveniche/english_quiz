import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
import CloseIcon from "@mui/icons-material/Close";
import QuestionCommonContent from "../../../CommonComponent/QuestionCommonContent";
export default function PreviewModal({ group_data, onClick }) {
  const handleClose = () => {
    typeof onClick === "function" && onClick();
  };

  console.log(group_data,'group_data')
  let obj=""
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
          {Object.keys(group_data?.questionName).map((item, index) => {
            const obj = { questionName: group_data.questionName[item] };
            return (
              <div style={{display:'flex',gap:"5px",marginTop:'10px'}} key={index}>
                {Object.keys(group_data?.questionName).length >0 && (index+1)}.
                <QuestionCommonContent obj={obj} />
              </div>
            );
          })}

        </Box>
      </Modal>
    </div>
  );
}
