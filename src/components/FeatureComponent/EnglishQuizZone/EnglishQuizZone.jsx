import React from "react";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import styles from "./EnglishQuizZoneOuter.module.css";
import styles2 from "./EnglishQuizZoneInner.module.css";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";

export default function EnglishQuiz() {
  return (
    <div
      className={`${styles.mainPage} h-full w-full m-0`}
      style={{ margin: 0, padding: 0, width: "100%" }}
    >
      <QuizPageLayout>
        <div className={styles.title2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold !important",
            }}
            id={styles.titleStatus}
          >
            English Quiz
          </div>
        </div>
        <div
          style={{
            position: "relative",
            margin: "0 auto",
            width: "calc(100% - 160px)",
            maxHeight: `calc(100% - 60px)`,
            minHeight: `calc(100% - 60px)`,
          }}
        >
          <QuizWhitePage>sdfghj</QuizWhitePage>
        </div>
      </QuizPageLayout>
    </div>
  );
}
