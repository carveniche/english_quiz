import React from "react";
import styles from "./common.module.css";

export default function QuestionTracker({ data }) {
  const { group_question_count = 0, group_question_index = -1 } = data || {};

  return (
    <div className={styles.question_tracker}>
      {Array.from({ length: group_question_count }, (_, index) => (
        <div key={index}
          className={`${styles.question_item} ${(index + 1) == group_question_index ? styles.active : ""}`}
        />

      ))}
    </div>
  );
}
