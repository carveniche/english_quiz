import React from "react";
import styles from "../component/OnlineQuiz.module.css";
export default function QuizWhitePage({ children }) {
  return (
    <>
      <div
        className={styles.whitePage}
        id="quizWhitePage"
        style={{ clear: "both" }}
      >
        {children}
      </div>
    </>
  );
}
