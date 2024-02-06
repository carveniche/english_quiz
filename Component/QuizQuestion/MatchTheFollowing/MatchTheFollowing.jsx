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
export default function MatchTheFollowing({ obj }) {
  const [redAlert, setRedAlert] = useState(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
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
