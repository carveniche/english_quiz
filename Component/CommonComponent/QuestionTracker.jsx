import React, { useState } from "react";
import styles from "./common.module.css";
import { useAppContext } from "../../../englishzone_view/store/AppContext";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from "@mui/material";
export default function QuestionTracker({ data }) {
  const { group_question_count = 0, group_question_index = -1 } = data || {};
  const { showHeader, showQuestionIndex } = useAppContext()
  return (
    <div className={styles.question_tracker}>
      {Array.from({ length: group_question_count }, (_, index) => (
        <div key={index}
          className={`${styles.question_item} ${(index + 1) == showQuestionIndex ? styles.active : ""}`}
        />

      ))}

      {showHeader==="review" && <QuestionNavigator group_question_count={group_question_count} />}
    </div>
  );
}

function QuestionNavigator({group_question_count}) {
  const { showHeader, showQuestionIndex, setShowQuestionIndex } = useAppContext()

  function handleShowQuestion(index) {
    setShowQuestionIndex((prev) => prev + index);
  }

  return (
    <div  className={styles.question_navigate_section  }>
      {/* Back Button */}
      <IconButton
        size="small"
        onClick={() => handleShowQuestion(-1)}
        disabled={showQuestionIndex === 1} // disable when at first question
      >
        <ArrowBackIosIcon  fontSize="18" />
      </IconButton>

      {/* Forward Button */}
      <IconButton
      size="small"
        onClick={() => handleShowQuestion(1)}
        disabled={showQuestionIndex === group_question_count} // disable when at last question
      >
        <ArrowForwardIosIcon  fontSize="18"/>
      </IconButton>
    </div>
  );
}
