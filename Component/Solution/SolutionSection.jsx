import React, { useContext, useEffect } from "react";
import styles from "./Solution.module.css";
import QuestionTypeResponse, {
  SolutionForDragDrop,
  SolutionForReordering,
  SolutionForWritingGpt,
} from "./utility/QuestionTypeResponse";
import { ValidationContext } from "../QuizPage";
import { WRITING_GPT } from "../Utility/Constant";
import Explanation from "./Explanation";
import { IconButton, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
export default function SolutionSection({
  obj,
  question_type,
  open,
  setClose
}) {
  let reordering = ["Horizontal Ordering", "Vertical Ordering"];
  let dragDrop = ["Math the Following"];
  const { setDisabledQuestion } = useContext(ValidationContext);
  const writingGpt = ["Writing ChatGpt", "read_the_text"];
  useEffect(() => {
    function disableTheQuestion() {
      setDisabledQuestion?.(true);
    }
    disableTheQuestion();
  }, []);

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <div className={styles.solution_modal_container}>
        <IconButton sx={stylesClose} onClick={() => setClose(false)}>
          <CloseIcon />
        </IconButton>
        <div className={styles.solution_modal_content}>
         {!writingGpt?.includes(question_type) && <h5 className="header_title grey_text">Solution :-</h5>}
          {reordering.includes(question_type) ? (
            <SolutionForReordering obj={obj} question_type={question_type} />
          ) : writingGpt?.includes(question_type) ? (
            <SolutionForWritingGpt
              question_type={question_type}
              obj={obj?.question_data}
              showSolution={true}
              userResponse={obj[WRITING_GPT.questionResponse]}
            />
          ) : dragDrop.includes(question_type) ? (
            <SolutionForDragDrop obj={obj} question_type={question_type} />
          ) : (
            <div className={`${styles.correctAnswer} ${styles.correctAnswer2}`}>
              <p className="para_text">The correct answer is :</p>
              <QuestionTypeResponse question_type={question_type} obj={obj} />
            </div>
          )}

          <Explanation obj={obj} />

        </div>
      </div>
    </Slide>
  );
}

const stylesClose = {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 1000,
  color: "#fff",
  backgroundColor: "#000",
  borderRadius: "50%",
  padding: "5px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#000",
    scale: '1.1',
  },
};