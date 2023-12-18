import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import { endRoomRequest } from "../../../redux/features/liveClassDetails";
import { useDispatch, useSelector } from "react-redux";
import { submitStudentFeedbackForm } from "../../../api";
import { RootState } from "../../../redux/store";

export default function StudentFeedbackForm2({
  selectedValue,
}: {
  selectedValue: object;
}) {
  const style = {
    width: "100%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxWidth: 800,
    margin: "10px auto",
    minHeight: 320,
    borderRadius: 5,
    maxHeight: "calc(100% - 40px)",
    overflow: "auto",
  };
  let [choices, setChoices] = useState([]);
  const [open, setOpen] = useState(true);
  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const dispatch = useDispatch();
  const feedbackData1: string[] = ["Teacher was good", "Class was interesting"];
  const feedbackData2: string[] = [
    "Class started late",

    "Couldn't hear my teacher",
    "Couldn't see the teacher",
    "Video did not work",
    "Class was not interesting",
    "Whiteboard was not working",
    "Teacher left the class early",
    "Teacher was not friendly",
    "Did not understand the lesson",
  ];
  const [loading, setLoading] = useState(false);
  const feedbackData = selectedValue?.id ? feedbackData1 : feedbackData2;
  const handleSubmit = async () => {
    let obj = {
      live_class_id: liveClassId,
      user_id: userId,
      student_id: userId,
      last_student: "yes",
      feedback: selectedValue?.text || "",
      comments: "",
    };
    let comments = feedbackData.join(",");
    setLoading(true);
    obj.comments = comments;
    await submitStudentFeedbackForm(obj);
    window.close();
    window.location.href = "https://www.begalileo.com/student/activity";
  };
  const handleChange = (i: number) => {
    if (!choices.includes(i)) {
      choices.push(i);
      setChoices([...choices]);
    } else {
      choices = choices.filter((item) => item != i);
      setChoices([...choices]);
    }
  };
  const handleClose = () => {
    dispatch(endRoomRequest(false));
  };
  return (
    <>
      <Modal open={true} onClose={handleClose}>
        <Box sx={style}>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="flex items-center flex-col gap-6 h-full">
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
                {selectedValue?.id ? (
                  <h2
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "rgb(103, 105, 113)",
                      textAlign: "center",
                    }}
                  >
                    Thank you <br /> What did you like?
                  </h2>
                ) : (
                  <h2
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "rgb(103, 105, 113)",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    What went <br /> wrong ?
                  </h2>
                )}
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {feedbackData?.map((item, i) => (
                  <div onClick={() => handleChange(i)} key={i}>
                    <input
                      type="checkbox"
                      className="hidden student-issues-checkbox"
                      id={"issue-" + (i + 1)}
                      checked={choices.includes(i)}
                    />
                    <label>{item}</label>
                  </div>
                ))}
              </div>
              <div>
                <Button variant="contained" onClick={handleSubmit}>
                  {selectedValue?.id ? "Submit Feedback" : "Submit issues"}
                </Button>
              </div>
              <div>
                <Button onClick={handleSubmit}>Skip This Step</Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
}
