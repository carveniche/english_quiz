import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";
export default function Choices({ choicesRef }) {
  const { studentAnswer, submitResponse, disabledQuestion,isEnglishTest } =
    useContext(ValidationContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleClick = (index) => {
    if (submitResponse || disabledQuestion) return;
    if (selectedIndex > -1)
      choicesRef.current[selectedIndex].isStudentAnswer = false;
    choicesRef.current[index].isStudentAnswer = true;
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (studentAnswer.length > 0) {
      choicesRef.current = choicesRef.current.map((c, i) => {
        if (studentAnswer[i]) {
          setSelectedIndex(i);
          c.isStudentAnswer = studentAnswer[i].studentAnswer;
        }
        return c;
      });
    }
  }, []);
  return (
    <div className={styles.mathzoneMultipleChoiceFlexBox}>
      {choicesRef?.current.map((choice, key) => {
        const isSelected =  choice?.isStudentAnswer;
        const showFeedback =   !isEnglishTest && submitResponse;
        const isCorrect = choice.correct;

        // Compose class names without external libraries
        const classNames = [
           isSelected && styles.mathzoneSelectedChoiceType,
           showFeedback && isCorrect && styles.greenCorrect,
           showFeedback && isSelected && !isCorrect && styles.redInCorrect
        ]
          .filter(Boolean)
          .join(" ");
          
       return ( 
        <div
          key={key}
          style={{
            padding: `1rem 1rem`,
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 7px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
            border: "none",
          }}
          className={classNames}
          onClick={() => handleClick(key)}
        >
          <div className={styles["mathzone-circle-selectbox"]}>
            <b>{String.fromCharCode(65 + key)}</b>
          </div>
          {choice?.value && <div>{parse(choice.value)}</div>}
          {choice?.choice_image && (
            <div className="choiceImage">
              <img
                style={{ maxWidth: "150px", maxHeight: "100px" }}
                src={choice?.choice_image}
              />
            </div>
          )}
        </div>
       )
   })}
    </div>
  )
}
