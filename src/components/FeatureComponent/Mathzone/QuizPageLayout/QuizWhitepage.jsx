import React from "react";
import styles from "../component/OnlineQuiz.module.css";
export default function QuizWhitePage({ children, style }) {
  return (
    <>
      <div
        className={styles.whitePage}
        id="quizWhitePage"
        style={
          style || {
            clear: "both",
            width: "100%",
            minHeight: "100%",
            maxHeight: "100%",
          }
        }
      >
        {children}
      </div>
    </>
  );
}
