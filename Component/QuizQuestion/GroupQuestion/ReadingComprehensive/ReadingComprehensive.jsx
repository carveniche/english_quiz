import React, { useContext, useEffect, useState } from "react";
import PassagePage from "./PassagePage";
import PreviewModal from "./PreviewModal";
import { Button } from "@mui/material";
import styles from "./Reading_Comprehensive.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";

export default function ReadingComprehensive({
  group_data,
  question_data,
  show_group_question,
}) {
  const {
    showQuestion,
    handleShowPreviewData,
    previewGroupData,
    currentQuestion,
    handleChangeQuestion,
    handleShowQuestion,
  } = useContext(GroupQuestionContext);
 
  return (
    <div className={styles.readingComprehensiveContainer}>
      <div className={styles.layout_section}>
        <h4 className={styles.title}>Read the passage and answer the questions.</h4>
        <PassagePage groupData={group_data} />
      </div>
    </div>
  );
}
