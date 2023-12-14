import React, { useState } from "react";
import HtmlParser from "react-html-parser";
import CorrectAnswerDisplay from "../CommonJsxComponent/CorrectAnswerDisplay";
import SolutionMultipleChoice from "../component/MultipleChoice/SolutionMultipleChoice";

import OnlineQuizSolutionModel from "../component/OnlineQuizSolutionModel";

import StudentSolution from "./StudentSolution";
export default function SolutionComponent({
  obj,
  arr,
  showExplation,
  handleExplation,
  isAnswerCorrect,
  temp,
  showStudentSolution,
  showTeacherSolution,
  showCorrectIncorrectImage,
  showExplanation,
}) {
  return (
    <>
      <>
        {showStudentSolution && (
          <StudentSolution
            isAnswerCorrect={isAnswerCorrect}
            obj={obj}
            temp={temp}
            showCorrectIncorrectImage={showCorrectIncorrectImage}
            showExplanation={showExplanation}
          />
        )}
      </>
      {showTeacherSolution && (
        <div>
          <div>
            {!arr.includes(obj?.question_data[0]?.operation && false) ? (
              ""
            ) : (
              <div>
                <div>
                  {false && (
                    <div
                      style={{
                        color: "black",
                        marginTop: "1rem",
                        marginLeft: "1.5rem",
                        fontSize: "20px",
                      }}
                    >
                      {((temp?.answer && temp?.answer !== "true") ||
                        temp?.answerValue ||
                        temp?.answerCount) && (
                        <b>
                          Correct Answer:&nbsp;&nbsp;
                          {temp?.answer ||
                          temp?.answerValue ||
                          temp?.answerCount
                            ? temp?.answer
                              ? HtmlParser(temp?.answer)
                              : HtmlParser(
                                  temp?.answerValue || temp?.answerCount
                                )
                            : ""}
                        </b>
                      )}
                    </div>
                  )}
                  <div></div>
                </div>
              </div>
            )}
            {arr.includes(obj?.question_data[0]?.question_type) ? (
              <></>
            ) : (
              <div
                style={{
                  color: "black",
                  margin: "0",
                  padding: "0",
                  fontSize: "18px",
                  wordSpacing: "6px",
                }}
              >
                {obj?.question_data[0]?.operation && (
                  <CorrectAnswerDisplay obj={temp} identity={"tutor"} />
                )}
                {obj?.question_data[0]?.operation ? (
                  temp?.solution?.model?.length > 0 && (
                    <>
                      <OnlineQuizSolutionModel model={temp?.solution?.model} />
                    </>
                  )
                ) : (
                  <SolutionMultipleChoice
                    model={obj?.question_data[0]?.choice_data}
                    type={obj?.question_data[0]?.question_type}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
