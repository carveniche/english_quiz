import React, { useEffect, useRef, useState } from "react";
import CondiitonalCorrectAnswer from "./CondiitonalCorrectAnswer";
import ExplanationBoxContainer from "./ExplanationBoxContainer";
import correctImages from "./assets/Images/correct.png";
import inCorrectImages from "./assets/Images/incorrect.png";
import styles from "./Solution.module.css";
export default function StudentSolution({
  isAnswerCorrect,
  obj,
  temp,
  showCorrectIncorrectImage,
}) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (showCorrectIncorrectImage) {
      if (scrollRef.current) scrollRef.current.scrollIntoView();
    }
  }, [showCorrectIncorrectImage]);
  return (
    <>
      <div style={{ width: "100%", height: 10 }} ref={scrollRef}></div>
      <div>
        {showCorrectIncorrectImage && (
          <div
            className={styles.quizCorrectInorrect}
            id="correctIncorrect_solution_mathzone"
          >
            <div>
              <img
                src={isAnswerCorrect ? correctImages : inCorrectImages}
                alt="correct"
                style={{ width: 50 }}
              />
            </div>
            <p style={{ margin: 0 }}>
              {isAnswerCorrect ? "Correct" : "InCorrect"}
            </p>
          </div>
        )}
        <CondiitonalCorrectAnswer
          questionData={obj?.question_data[0]}
          temp={temp}
        />

        <ExplanationBoxContainer
          questionData={obj?.question_data[0]}
          temp={temp}
        />
      </div>
    </>
  );
}
