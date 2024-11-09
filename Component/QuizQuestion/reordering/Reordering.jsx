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
export default function Reordering({ obj, direction, questionResponse }) {
  const choiceRef = useRef([]);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
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
  var textNodes = obj?.questionName.filter((node) => node.node !== "img");
  return (
    <div>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}

      <div>
        <div className={styles.questionName}>
          <SpeakQuestionText readText={textNodes} />
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

        {/* <div style={{ margin: "25px 0" }}>
          <ResourceViewer resources={obj?.resources || []} />
        </div> */}
    {obj?.resources.length>0 && <AudiPlayerComponent  resources={obj?.resources || []}/>}

        <Dragdrop
          choiceRef={choiceRef}
          questionData={obj?.questionContent}
          response={questionResponse || []}
          direction={direction}
        />
      </div>
    </div>
  );
}
