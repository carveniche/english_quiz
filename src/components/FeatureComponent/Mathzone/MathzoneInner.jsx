import React from "react";
import QuizPageLayout from "./QuizPageLayout/QuizPageLayout";
import styles from "./component/OnlineQuiz.module.css";
import styles2 from "./outerPage.module.css";
import QuizWhitePage from "./QuizPageLayout/QuizWhitepage";
import { RenderingQuizPage } from "./MainOnlineQuiz/MainOnlineQuizPage";
import jsonDataTesting from "./component/TestingData";
export default function MathzoneInner() {
  let obj = jsonDataTesting();
  return (
    <>
      <div
        className={`${styles.mainPage} h-full w-full m-0`}
        style={{ margin: 0, padding: 0, width: "100%" }}
      >
        <QuizPageLayout>
          <QuizWhitePage>
            <RenderingQuizPage obj={obj} identity={"testing"} />
          </QuizWhitePage>
        </QuizPageLayout>
      </div>
    </>
  );
}
