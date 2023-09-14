import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import "../index.css";
import StudentFeedbackForm2 from "./StudentFeedbackForm2";
import { useDispatch } from "react-redux";
import { endRoomRequest } from "../../../redux/features/liveClassDetails";
export default function StudentFeedBackForm() {
  const style = {
    width: "100%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxWidth: 800,
    margin: "10px auto",
    minHeight: 300,
    borderRadius: 5,
  };
  const [open, setOpen] = useState(true);
  const [value, setValue] = React.useState(0);
  const [isDone, setIsDone] = useState(false);
  const dispatch = useDispatch();
  const feedbackMeter = [
    {
      text: "Very Good",
      img: "/static/media/feedbackformEmoji/Very-good.svg",
      id: 2,
    },
    {
      text: "Good",
      img: "/static/media/feedbackformEmoji/Good.svg",
      id: 1,
    },
    {
      text: "Not Good",
      img: "/static/media/feedbackformEmoji/Not-good.svg",
      id: 0,
    },
  ];
  const handleChange = (e: Event) => {
    setValue(e.target?.value || 0);
  };

  const handleDone = () => {
    setIsDone(true);
  };
  const handleClose = () => {
    dispatch(endRoomRequest(false));
  };
  return isDone ? (
    <>
      <StudentFeedbackForm2 selectedValue={feedbackMeter[value]} />
    </>
  ) : (
    <>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className="flex flex-col items-center gap-4">
            <div
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "rgb(35, 53, 132)",
              }}
            >
              Rate Your Class
            </div>
            <div>
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "rgb(103, 105, 113)",
                }}
              >
                How was today's class?
              </h2>
            </div>
            <div
              className="flex flex-col gap-4"
              style={{ width: "100%", margin: "auto" }}
            >
              <div style={{ width: "fit-content", margin: "auto" }}>
                <img
                  src={feedbackMeter[value].img}
                  alt={feedbackMeter[value].text}
                  style={{ maxWidth: "100%" }}
                />
              </div>
              <div style={{ width: "fit-content", margin: "auto" }}>
                <p style={{ fontSize: 20, color: "rgb(103, 105, 113)" }}>
                  {feedbackMeter[value].text}
                </p>
              </div>
            </div>
            <div style={{ width: "80%", margin: "auto" }}>
              <input
                type="range"
                className="range-slider__range"
                max={2}
                value={value}
                onChange={handleChange}
              />
            </div>
            <div>
              <Button variant="contained" onClick={handleDone}>
                Done
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
