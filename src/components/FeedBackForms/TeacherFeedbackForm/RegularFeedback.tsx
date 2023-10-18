import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextareaAutosize,
} from "@mui/material";
import { useState } from "react";
import { submitStudentFeedbackForm } from "../../../api";

export default function RegularFeedback({
  userId,
  liveClassId,
}: {
  userId: string;
  liveClassId: string;
}) {
  let [choices, setChoices] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const style = {
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    minWidth: 500,
    height: "fit-content",
    margin: "10px auto",
    minHeight: 300,
    borderRadius: 5,
  };
  const teacherComments = [
    {
      id: "1",
      name: "All well, no issues at all",
      checked: false,
    },
    {
      id: "2",
      name: "Whiteboard not working",
      checked: false,
    },
    {
      id: "3",
      name: "Document did not get uploaded",
      checked: false,
    },
    {
      id: "4",
      name: "Audio issues",
      checked: false,
    },
    {
      id: "5",
      name: "Cannot see the child",
      checked: false,
    },
    {
      id: "6",
      name: "Child cannot see me",
      checked: false,
    },
    {
      id: "7",
      name: "Lesson video did not play",
      checked: false,
    },
    {
      id: "8",
      name: "Quiz did not work",
      checked: false,
    },

    {
      id: "9",
      name: "Speed math did not work",
      checked: false,
    },
    {
      id: "10",
      name: "Error in content observed",
      checked: false,
    },
  ];
  const handleChange = (i: number) => {
    if (!choices.includes(i)) {
      choices.push(i);
      setChoices([...choices]);
    } else {
      choices = choices.filter((item) => item != i);
      setChoices([...choices]);
    }
    setShowError(false);
  };
  const handeCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value || "");
  };
  const handleSubmit = async () => {
    if (!choices.length) {
      setShowError(true);
      return;
    }
    let feedback: string[] = [];
    for (let item of choices) {
      feedback.push(teacherComments[item].name);
    }
    let paramsObj = {
      user_id: userId,
      live_class_id: liveClassId,
      feedback: feedback.join(","),
      comments: comments,
      is_completed: isCompleted ? "yes" : "no",
    };
    setLoading(true);
    await submitStudentFeedbackForm(paramsObj);
    window.close();
    window.location.href = "https://www.begalileo.com/online_teachers";
  };
  return (
    <>
      {" "}
      <Modal open={true}>
        <div className="w-full max-w-[1000px] m-auto max-h-full overflow-auto">
          <Box sx={style}>
            <div>
              <h3
                style={{
                  color: "rgb(0, 105, 217)",
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Teacher Feedback
              </h3>
            </div>
            <hr />
            {loading ? (
              <h3 style={{ fontSize: 18, textAlign: "center" }}>Loading...</h3>
            ) : (
              <>
                <div className="flex justify-center gap-2 flex-wrap mt-2">
                  {teacherComments?.map((item, i) => (
                    <div onClick={() => handleChange(i)} key={i}>
                      <input
                        type="checkbox"
                        className="hidden student-issues-checkbox"
                        id={"issue-" + (i + 1)}
                        checked={choices.includes(i)}
                      />
                      <label>{item.name}</label>
                    </div>
                  ))}
                </div>

                {showError && (
                  <p
                    className="feedback_error_msg w-full text-center mt-2"
                    style={{ color: "red" }}
                  >
                    Please Select One
                  </p>
                )}
                <div className="flex gap-2 justify-center mt-8">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isCompleted}
                        onChange={() => setIsCompleted((prev) => !prev)}
                      />
                    }
                    label="Class completed"
                  />
                </div>
                <div className="flex gap-2 flex-col items-center mt-8">
                  <div style={{ width: 190, minWidth: 190 }}>
                    <label>Comments (optional)</label>
                  </div>
                  <div className="max-w-max-full w-[500px]">
                    <TextareaAutosize
                      minRows={3}
                      style={{
                        width: "100%",
                        border: "1px solid black",
                        padding: 5,
                        borderRadius: 5,
                        maxWidth: "100%",
                      }}
                      placeholder="Your Comments"
                      onChange={handeCommentChange}
                      value={comments}
                    />
                  </div>
                  <hr />
                  <div style={{ textAlign: "center" }} className="mt-2">
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit Teacher Feedback
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Box>
        </div>
      </Modal>
    </>
  );
}
