import React, { useContext, useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "./choice.module.css";
import { ValidationContext } from "../../QuizPage";
export default function Choices({ choicesRef}) {

  const { studentAnswer, isGroup,submitResponse, disabledQuestion, showSolution } =
    useContext(ValidationContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [choiceData,setChoiceData]=useState(choicesRef.current)
  const handleClick = (index) => {
    if (submitResponse || disabledQuestion) return;
    if (selectedIndex > -1)
      choicesRef.current[selectedIndex].studentAnswer = false;
      choicesRef.current[index].studentAnswer = true;
    setSelectedIndex(index);
    setChoiceData(choicesRef.current)
  };

  useEffect(() => {
    if (studentAnswer.length > 0 && showSolution) {
      // const temStudentAnswer = choicesRef.current.map((c, i) => {
      //   if (studentAnswer[i]) {
      //     setSelectedIndex(i);
      //     c.studentAnswer = studentAnswer[i].studentAnswer;
      //   }
      //   return c;
      // });
      setChoiceData(studentAnswer)
    }
  }, [studentAnswer]);

  return (
    <div className={`${styles.choices_wrapper} ${isGroup ? styles.flex_col :""}`}>
      {choiceData && choiceData.map((choice, key) => {
        const isSumbit = showSolution || submitResponse
        const isSelected = choice?.studentAnswer
        const isCorrect = choice.correct;
        const isInCorrect = choice?.studentAnswer == true && choice.correct == false
        // Compose class names without external libraries
        const classNames = [
          styles.choiceType,
          !isSumbit && isSelected && styles.selectedChoiceType,
          isSumbit && isCorrect && styles.green,
          isSumbit && isInCorrect && styles.red,
          (isSumbit || disabledQuestion) &&  styles.notHoverClass
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


//  <div

//           key={key}
//           style={{
//             padding: `1rem 1rem`,
//             boxShadow:
//               "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 7px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
//             border: "none",
//           }}
//           className={`${classNames} choice_card`}
//           onClick={() => handleClick(key)}
//         >
//           <div className={styles["mathzone-circle-selectbox"]}>
//             <b>{String.fromCharCode(65 + key)}</b>
//           </div>
//           {choice?.value && <div className="para_text">{parse(choice.value)}</div>}
//           {choice?.choice_image && (
//             <div className="choiceImage">
//               <img
//                 style={{ maxWidth: "150px", maxHeight: "100px" }}
//                 src={choice?.choice_image}
//               />
//             </div>
//           )}
//         </div>