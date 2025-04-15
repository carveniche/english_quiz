import React, { useContext, useRef, useState } from "react";
import Dragdrop from "./Dragdrop";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { ValidationContext } from "../../QuizPage";
import styles from "../english_mathzone.module.css";
import objectParser from "../../Utility/objectParser";
import SolveButton from "../../CommonComponent/SolveButton";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
export default function Reordering({ obj, direction, questionResponse }) {


  const choiceRef = useRef([]);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    readOut
  } = useContext(ValidationContext);
  const [redAlert, setRedAlert] = useState(false);
  const handleSubmit = () => {
    if (submitResponse) return -2;
    if (disabledQuestion) return -2;
    let choicesA = JSON.stringify(obj?.questionContent);
    let choicesB = JSON.stringify(choiceRef.current);
    let correctValue = -1;
    if (choicesA === choicesB) {
      correctValue = 1;
    } else correctValue = 0;
    setSubmitResponse(true);
    setStudentAnswer(choicesB);
    setIsCorrect(correctValue);
    return correctValue;
  };



  // localStorage.getItem("isEnglishStudentLevel") || false;


  return (
    <>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}

      <div>

        <QuestionCommonContent
          obj={obj}
          wordsLength={[]}
          choicesRef={obj?.questionContent}
          isEnglishStudentLevel={readOut}
        />

        <Dragdrop
          choiceRef={choiceRef}
          questionData={obj?.questionContent}
          response={questionResponse || []}
          direction={direction}

        />


      </div>
    </>
  );
}
