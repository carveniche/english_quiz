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
export default function MultipleChoice({ obj, wordsLength }) {
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
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

  var textNodes = obj?.questionName.filter((node) => node.node !== "img");
  var imageNodes = obj?.questionName.filter((node) => node.node === "img");
  const isEnglishStudentLevel =
    localStorage.getItem("isEnglishStudentLevel") || false;
  console.log("isEnglishStudentLevel", isEnglishStudentLevel);
  return (
    <div>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      {/* {obj?.resources?.length > 0 && (
        <div>
          <ResourceViewer resources={obj?.resources || []} />
        </div>
      )} */}
      <div>
        <div
          style={{ paddingLeft: obj?.resources?.length > 0 ? "50px" : "" }}
          className={styles.questionName}
        >
          {textNodes && imageNodes ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <div
                className={`${wordsLength <= 30 ? styles.biggerFont : ""}`}
                style={{
                  display: "flex",
                  alignItems: wordsLength <= 30 ? "center" : "",
                }}
              >
                {isEnglishStudentLevel && (
                  <SpeakQuestionText readText={textNodes} />
                )}
                <div>
                  {textNodes &&
                    textNodes.length > 0 &&
                    textNodes.map((item, key) => (
                      <React.Fragment key={key}>
                        {objectParser(item, key)}
                      </React.Fragment>
                    ))}

                <div>
                {obj?.resources.length>0 && <AudiPlayerComponent  resources={obj?.resources || []}/>}
                </div>
                </div>
              </div>
              <div>
                {imageNodes &&
                  imageNodes.length > 0 &&
                  imageNodes.map((item, key) => (
                    <React.Fragment key={key}>
                      {objectParser(item, key)}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          ) : (
            <>
              {obj?.questionName?.length ? (
                <>
                  {obj?.questionName.map((item, key) => (
                    <React.Fragment key={key}>
                      {objectParser(item, key)}
                    </React.Fragment>
                  ))}
                </>
              ) : null}
            </>
          )}

          {/* {obj?.questionName?.length ? (
            <>
              {obj?.questionName.map((item, key) => (
                <React.Fragment key={key}>
                  {objectParser(item, key)}
                </React.Fragment>
              ))}
            </>
          ) : null} */}
        </div>
        <Choices choicesRef={choicesRef} />
      </div>
    </div>
  );
}
