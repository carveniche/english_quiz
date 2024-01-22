import React, { useContext, useState } from "react";
import correctImages from "../assets/Images/correct.png";
import inCorrectImages from "../assets/Images/incorrect.png";
import styles from "./Solution.module.css";
import { ValidationContext } from "../QuizPage";
import ConditionalCorrectIncorrect from "./ConditionalCorrectIncorrect";
import Explanation from "./Explanation";
export default function CorrectIncorrectStatus({ showCorrectIncorrect, obj }) {
  const [showCorrectIncorrectImage, setShowCorrectIncorrectImage] =
    useState(false);

  const { isCorrect } = useContext(ValidationContext);
  const handleShowCorrectIncorrectImage = () => {
    setShowCorrectIncorrectImage(true);
    handleShowCorrectOption()
  };
  const [showCorrectOption, setShowCorrectOption] = useState(
    showCorrectIncorrect || false
  );
  const handleShowCorrectOption = () => {
    setShowCorrectOption(true);
  };
  window.reactEnglishHandleShowCorrectOption = handleShowCorrectOption;
  window.handleShowCorrectIncorrectImage = handleShowCorrectIncorrectImage;
  return showCorrectOption ? (
    <div style={{ marginTop: 10 }}>
      {showCorrectIncorrectImage &&
        (isCorrect === 0 || isCorrect === 1 ? (
          <div className={styles.quizCorrectInorrect}>
            <div>
              <img
                src={isCorrect === 1 ? correctImages : inCorrectImages}
                alt="correct"
                style={{ width: 50 }}
              />
            </div>
            <p style={{ margin: 0 }}>
              {isCorrect === 1 ? "Correct" : "InCorrect"}
            </p>
          </div>
        ) : (
          ""
        ))}
      <ConditionalCorrectIncorrect
        obj={obj}
        question_type={obj?.question_type}
      />
      <Explanation obj={obj} />
    </div>
  ) : null;
}
