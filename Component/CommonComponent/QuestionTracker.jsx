import React, { useEffect, useState } from "react";
import styles from "./common.module.css";
// import { useAppContext } from "../../../englishzone_view/store/AppContext";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from "@mui/material";
export default function QuestionTracker({ data }) {

  const { group_question_count = 0 } = data || {};

  const { showHeader,question_index:showQuestionIndex   } = data || {}
  
  return (
    <div className={styles.question_tracker}>
      {Array.from({ length: group_question_count }, (_, index) => (
        <div key={index}
          className={`${styles.question_item} ${(index + 1) == showQuestionIndex ? styles.active : ""}`}
        />

      ))}

      {showHeader === "review" && <QuestionNavigator data={data} group_question_count={group_question_count} />}
    </div>
  );
}

function QuestionNavigator({ group_question_count, data }) {
  const { showHeader, state, showQuestionIndex, setShowQuestionIndex } = useAppContext()

  function handleShowQuestion(index) {
    setShowQuestionIndex((prev) => prev + index);
  }

  const [isNextDisabled, setIsNextDisabled] = useState(false);
  useEffect(() => {
    if (state?.question_data && state?.question_data?.question_data) {
      let isTrue = state?.question_data?.question_data.length == 1 || showQuestionIndex >= (state?.question_data?.question_data.length)
      setIsNextDisabled(isTrue);
    } else {
      setIsNextDisabled(false)
    }
  }, [state, showQuestionIndex]);
  if (state?.question_data?.question_data.length == 1) {
    return <></>

  }
  return (
    <div className={styles.question_navigate_section}>
      {/* Back Button */}
      <IconButton
        size="small"
        onClick={() => handleShowQuestion(-1)}
        disabled={showQuestionIndex === 1} // disable when at first question
      >
        <ArrowBackIosIcon fontSize="18" />
      </IconButton>

      {/* Forward Button */}
      <IconButton
        size="small"
        onClick={() => handleShowQuestion(1)}
        disabled={isNextDisabled} // disable when at last question
      >
        <ArrowForwardIosIcon fontSize="18" />
      </IconButton>
    </div>
  );
}
