import React from "react";
import styles from "../component/OnlineQuiz.module.css";
export default function QuizWhitePage({ children }) {
  return (
    <>
      <div
        className={styles.whitePage}
        id="quizWhitePage"
        style={{
          clear: "both",
          width: "100%",
          minHeight: "100%",
          maxHeight: "100%",
        }}
      >
        {children}
      </div>
    </>
  );
}
