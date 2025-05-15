import React, { useContext, useRef, useState } from "react";
import styles from "../english_mathzone.module.css";
import Choices from "./Choices";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { ValidationContext } from "../../QuizPage";
import SolveButton from "../../CommonComponent/SolveButton";
import objectParser from "../../Utility/objectParser";
import { STUDENTANSWER } from "../../Utility/Constant";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
export default function MultipleChoice({ obj, wordsLength }) {
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    readOut
  } = useContext(ValidationContext);
  const choicesRef = useRef(obj?.choices || []);
  const [redAlert, setRedAlert] = useState(false);
  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    let choices = choicesRef.current || [];
    let isValidate = false;
    let selectedItem = "";
    for (let item of choices) {
      if (item?.isStudentAnswer) {
        selectedItem = item;
        isValidate = true;
        break;
      }
    }
    let status = -1;
    if (isValidate) {
      if (selectedItem?.correct && selectedItem?.isStudentAnswer) {
        setIsCorrect(1);
        status = 1;
      } else {
        setIsCorrect(0);
        status = 0;
      }
      setRedAlert(false);
      for (let item of choices) {
        item[STUDENTANSWER] = item?.isStudentAnswer;
      }
      setStudentAnswer(JSON.stringify(choices));
      setSubmitResponse(true);
    } else {
      setRedAlert(true);
    }
    return status;
  };

  return (
    <>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div>
        <QuestionCommonContent
          obj={obj}
          wordsLength={wordsLength}
          choicesRef={choicesRef}
          isEnglishStudentLevel={readOut}
        />
        <Choices choicesRef={choicesRef} />
      </div>
    </>
  );
}
