import React, { useContext, useEffect, useRef, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import styles from "../english_mathzone.module.css";
import QuestionContent, { QuestionContentSec } from "./QuestionContent";
import { ValidationContext } from "../../QuizPage";
import { STUDENTANSWER } from "../../Utility/Constant";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import { checkTwoString } from "../../Utility/stringValidation";
import objectParser from "../../Utility/objectParser";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
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


  var data = obj?.choices.flatMap((sda) => {
    return sda.value.split(" ").map((val) => ({
      correct: sda.correct,
      value: val,
     ...(showSolution && {studentAnswer: sda.studentAnswer }|| {})
    }));
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
  var textNodes = obj?.questionName.filter((node) => node.node !== "img");
  var imageNodes = obj?.questionName.filter((node) => node.node === "img");
 const isEnglishStudentLevel = readOut
    // localStorage.getItem("isEnglishStudentLevel") || false;
  return (
    <div>
      {/* <div
        style={{
          color: "#00b8fa",
          fontWeight: "bold",
          padding: "16px 5px 22px 0px",
          fontSize: "18px",
        }}
      >
        Fill in the Blanks
      </div> */}
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && (
        <CustomAlertBoxMathZone msg={"Please Type the Answer"} />
      )}

      <div>
        <div className={styles.questionName}>
          {textNodes && imageNodes ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <div
                className={`${wordsLength <= 30 ? styles.biggerFont : ""}`}
                style={{
                  display: "flex",
                  alignItems: wordsLength <= 30 ? "center" : "",
                }}
              >
                <div>
                  <div style={{ display: "flex" }}>
                    <div className="audio_with_questiontext">
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
                    </div>
                    </div>
                  </div>
                  {obj?.resources && obj?.resources.length > 0 && (
                    <AudiPlayerComponent resources={obj?.resources || []} />
                  )}

                  {choicesRef.current.length <=1?
                  <QuestionContent choicesRef={choicesRef} /> 
                    :
                  <QuestionContentSec choicesRef={choicesRef}/>
                  }
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

        <br />
        {/* {obj?.resources.length > 0 && (
          <AudiPlayerComponent resources={obj?.resources || []} />
        )} */}
      </div>
    </div>
  );
}
