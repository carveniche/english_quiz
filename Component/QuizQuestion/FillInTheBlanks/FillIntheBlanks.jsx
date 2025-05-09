import React, { useContext,  useRef, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { ValidationContext } from "../../QuizPage";
import { STUDENTANSWER } from "../../Utility/Constant";
import { checkTwoString } from "../../Utility/stringValidation";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
export default function FillIntheBlanks({ obj, wordsLength }) {
  const [redAlert, setRedAlert] = useState(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    showSolution,
    readOut
  } = useContext(ValidationContext);


  const data = obj?.choices?.map((sda) => {
    const combinedValue = sda.value
      .split(/\s+/) // split by spaces
      .filter(Boolean) // remove any empty strings
      .join(' '); // join back into one string

    return {
      correct: sda.correct,
      value: combinedValue,
      ...(showSolution ? { studentAnswer: sda.studentAnswer } : {})
    };
  });


  const choicesRef = useRef(data || []);

  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;

    // choicesRef.current[0].studentAnswer = choicesRef.current[0].studentAnswer.join("")
    choicesRef.current.forEach((choice) => {
      if (Array.isArray(choice.studentAnswer)) {
        choice.studentAnswer = choice.studentAnswer.join("");
      }
    });

    console.log("current choices", choicesRef.current);
    let arr = choicesRef.current || [];
    let answerStatus = -1;
    for (let item of arr) {
      if (item?.correct) {
        if (item?.studentAnswer && item?.studentAnswer.trim()) {
          if (checkTwoString(item?.value, item?.studentAnswer)) {
            if (answerStatus) {
              answerStatus = 1;
            }
          } else {
            answerStatus = 0;
          }
        } else {
          setRedAlert(true);
          return -1;
        }
      }
    }
    for (let item of arr) {
      const value = item?.studentAnswer || "";
      item[STUDENTANSWER] = value.trim() || "";
    }
    setSubmitResponse(true);
    setStudentAnswer(JSON.stringify(arr));
    setIsCorrect(answerStatus);

    return answerStatus;
  };
 
  return (
    <>

      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && (
        <CustomAlertBoxMathZone msg={"Please Type the Answer"} />
      )}

      <QuestionCommonContent
        isFrom="fill_in_the_blanks"
        obj={obj}
        wordsLength={wordsLength}
        choicesRef={choicesRef}
        isEnglishStudentLevel={readOut}
      />

    </>
  );
}
