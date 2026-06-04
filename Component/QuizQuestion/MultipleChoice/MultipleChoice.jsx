import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../english_zone.module.css";
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
  const [choiceData, setChoiceData] = useState([]);
  const [redAlert, setRedAlert] = useState(false);
 
 
 useEffect(() => {
  if (!obj?.choices) return;
  if (submitResponse) return;
  if (disabledQuestion) return;

  choicesRef.current = obj.choices.map(choice => ({
    ...choice
  }));
  setChoiceData(choicesRef.current);
}, [obj?.choices]);


  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    let choices = choicesRef.current || [];
    let isValidate = false;
    let selectedItem = "";
    for (let item of choices) {
      if (item?.isSelected) {
        selectedItem = item;
        isValidate = true;
        break;
      }
    }
    let status = -1;
    if (isValidate) {
      if (selectedItem?.correct && selectedItem?.isSelected) {
        setIsCorrect(1);
        status = 1;
      } else {
        setIsCorrect(0);
        status = 0;
      }
      setRedAlert(false);
      const finalChoices = choices.map(item => ({
        ...item,
        [STUDENTANSWER]: item.isSelected,
        isSelected: undefined
      }));

      setStudentAnswer(JSON.stringify(finalChoices));
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
      <div  style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        <QuestionCommonContent
          obj={obj}
          wordsLength={wordsLength}
          choicesRef={choicesRef}
          isEnglishStudentLevel={readOut}
        />
        <Choices choicesRef={choicesRef}  setChoiceData={setChoiceData} choiceData={choiceData}/>
      </div>
    </>
  );
}
