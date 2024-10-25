import React, { useContext, useRef, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import styles from "../english_mathzone.module.css";
import QuestionContent from "./QuestionContent";
import { ValidationContext } from "../../QuizPage";
import { STUDENTANSWER } from "../../Utility/Constant";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import { checkTwoString } from "../../Utility/stringValidation";
import objectParser from "../../Utility/objectParser";
import QuestionImageTextGrouped from "../../CommonComponent/QuestionImageTextGrouped";
export default function FillIntheBlanks({ obj }) {
  const choicesRef = useRef(obj?.choices || []);
  const [redAlert, setRedAlert] = useState(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
  } = useContext(ValidationContext);

  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
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

  var textNodes = obj.questionName.filter((node) => node.node !== "img");
  var imageNodes = obj.questionName.filter((node) => node.node === "img");

  return (
    <div>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div>
        <ResourceViewer resources={obj?.resources || []} />
      </div>
      <div>
        <div className={styles.questionName}>
          <QuestionImageTextGrouped questionData={obj?.questionName} />
        </div>
        <QuestionContent choicesRef={choicesRef} />
      </div>
    </div>
  );
}
