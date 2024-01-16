import React, { useContext, useRef, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import styles from "../english_mathzone.module.css";
import QuestionContent from "./QuestionContent";
import { ValidationContext } from "../../QuizPage";
import { STUDENTANSWER } from "../../Utility/Constant";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
const checkTwoString=(a,b)=>{
  a=a||""
  b=b||""
  a=a.toLowerCase()
  b=b.toLowerCase();
  a=a.trim()
  b=b.trim()
  return a==b 
}
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
  const objectParser = (item, index) => {
    let value = "";
    if (item?.node === "text") {
      value = <>{item?.value}</>;
    } else if (item?.node === "img") {
      value = <img src={item?.value} />;
    } else if (item?.node === "audio") {
      value = <>Audio symbol</>;
    }
    if (item?.inNewLine) return <div>{value}</div>;
    return value;
  };
  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    let arr = choicesRef.current || [];
    let answerStatus = -1;
    for (let item of arr) {
      if (item?.correct) {
        if (item?.studentAnswer && item?.studentAnswer.trim()) {
          if (checkTwoString(item?.value ,item?.studentAnswer.trim)) {
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
    <div>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div>
        <ResourceViewer resources={obj?.resources || []} />
      </div>
      <div>
        <div className={styles.questionName}>
          {obj?.questionName?.length ? (
            <>
              {obj?.questionName.map((item, key) => (
                <React.Fragment key={key}>
                  {objectParser(item, key)}
                </React.Fragment>
              ))}
            </>
          ) : null}
        </div>
        <QuestionContent choicesRef={choicesRef} />
      </div>
    </div>
  );
}
