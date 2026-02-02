import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "./choice.module.css";
import { ValidationContext } from "../../QuizPage";
export default function Choices({ choicesRef,choiceData,setChoiceData}) {
  const { studentAnswer, isGroup, submitResponse, disabledQuestion, showSolution } =
    useContext(ValidationContext);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleClick = (index) => {
    if (submitResponse || disabledQuestion) return;
    if (selectedIndex > -1)
     choicesRef.current[selectedIndex].isSelected = false;
     choicesRef.current[index].isSelected = true;
    setSelectedIndex(index);
    setChoiceData(choicesRef.current)
  };

  useEffect(() => {
    if (studentAnswer.length > 0 && showSolution) {
      setChoiceData(studentAnswer)
    }
  }, [studentAnswer]);


  return (
    <div className={`${styles.choices_wrapper} ${isGroup ? styles.flex_col : ""}`}>
      {choiceData && choiceData.map((choice, key) => {
        const isSumbit = showSolution || submitResponse || disabledQuestion;
        const isSelected = choice?.isSelected
        const isCorrect = (submitResponse || disabledQuestion) && choice.correct;
        const isInCorrect = choice?.isSelected == true && choice.correct == false
        const isInCorrectAnswer = disabledQuestion && choice?.studentAnswer && choice?.studentAnswer == true && choice.correct == false;
        const classNames = [
          styles.choiceType,
          !isSumbit && isSelected && styles.selectedChoiceType,
          isSumbit && isCorrect && styles.green,
          isSumbit && (isInCorrect) && styles.red,
          isInCorrectAnswer && styles.red,
          (isSumbit || disabledQuestion) && styles.notHoverClass
        ]
          .filter(Boolean)
          .join(" ");

        return (

          <div
            className={classNames}
            key={key}
            onClick={() => handleClick(key)}
          >
            <div className={styles.choiceTypeInner}>
              <div className={` ${styles.circle}`}>
                <b>{String.fromCharCode(65 + key)}</b>
              </div>
              <div className={`${styles.choice_text}`}>
                {choice?.value && <>{parse(choice.value)}</>}
                {choice?.choice_image && (
                  <div className="choiceImage">
                    <img
                      style={{ maxWidth: "150px", maxHeight: "100px" }}
                      src={choice?.choice_image}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>


        )
      })}
    </div>
  )
}

