import React, { useContext, useRef, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import { ValidationContext } from "../../QuizPage";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import styles from "../english_mathzone.module.css";
import objectParser from "../../Utility/objectParser";
import DragDrop from "./DragDrop";
import { checkTwoString } from "../../Utility/stringValidation";
import { STUDENTANSWER } from "../../Utility/Constant";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
export default function MatchTheFollowing({ obj }) {
  const [redAlert, setRedAlert] = useState(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    readOut
  } = useContext(ValidationContext);
  const choicesRef = useRef(obj?.question_content || []);
  const handleSubmit = () => {
    if (submitResponse || disabledQuestion) return;
    let arr = choicesRef.current || [];
    let isValidate = 1;
    for (let item of arr) {
      if (item.isMissed) {
        if (item.show) {
          if (!checkTwoString(item?.value || "", item?.dropVal || "")) {
            isValidate = 0;
          }
        } else {
          setRedAlert(true);
          return;
        }
      }
    }
    arr = arr.map((item) => {
      if (item?.correct) item[STUDENTANSWER] = item?.dropVal || "";
      const { show, dropVal, ...rest } = item;
      return { ...rest };
    });
    setIsCorrect(isValidate);
    setSubmitResponse(true);
    setStudentAnswer(JSON.stringify(arr));
    return isValidate;
  };

  // localStorage.getItem("isEnglishStudentLevel") || false;
  return (
    <>
      <div>
        <SolveButton onClick={handleSubmit} />
        {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
        {obj?.resources?.length > 0 && (
          <div>
            <ResourceViewer resources={obj?.resources || []} />
          </div>
        )}
        <div>

            <QuestionCommonContent
                    obj={obj}
                    wordsLength={[]}
                    choicesRef={obj?.question_content}
                    isEnglishStudentLevel={readOut}
                  />
          <DragDrop
            choiceRef={choicesRef}
            questionContent={obj?.question_content || []}
            choices={obj?.choices || []}
            disabledQuestion={disabledQuestion}
            submitResponse={submitResponse}
          />
        </div>
      </div>
    </>
  );
}
