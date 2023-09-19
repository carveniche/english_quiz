import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import { parentFeedbackApi } from "../../../api";

interface SuggestionCommentsModalProps {
  liveClassId: number;
  userId: number;
  student_id: number;
  handleClose: () => void;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function SuggestionCommentsModal({
  liveClassId,
  userId,
  student_id,
  handleClose,
}: SuggestionCommentsModalProps) {
  const [suggestionComments, setSuggestionComments] = useState("");

  const handleChange = (e: any) => {
    setSuggestionComments(e.target.value);
  };

  const submitFeedback = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("live_class_id", String(liveClassId));
    bodyFormData.append("user_id", String(userId));
    bodyFormData.append("student_id", String(student_id));
    bodyFormData.append("suggestions", suggestionComments);

    try {
      const response = await parentFeedbackApi(bodyFormData);

      if (response.data.status) {
        alert("Your Response has been Submitted");
        handleClose();
      } else {
        alert("Unable to send feedback at the moment, please try again later");
      }
    } catch (error) {
      console.error("An error occurred while sending feedback:", error);
    }
  };
  return (
    <div>
      <div>
        <Modal
          open={true}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex justify-center items-center">
              <textarea
                id="input"
                name="input"
                placeholder="Your comments !!!"
                className="w-full h-[200px] px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-300"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex justify-around flex-row items-center mt-5">
              <Button
                onClick={submitFeedback}
                variant="contained"
                color="primary"
              >
                Submit Feedback
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
