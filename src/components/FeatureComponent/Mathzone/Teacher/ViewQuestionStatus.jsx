import React, { useContext, useEffect } from "react";
import { viewQuestionStatusApi } from "../../../../api";
import TeacherViewEachResponse from "./TeacherViewEachResponse";
import { ViewStatusContext } from "../mathzone";

export default function ViewQuestionStatus({
  totalQuestion,
  identity,
  practiceId,
  handleWindowListener,
}) {
  const [totalQuestionArray, setTotalQuestionArray] = React.useState(
    new Array(totalQuestion || 5).fill(1)
  );
  const [openResponse, setOpenResponse] = React.useState(false);
  const { handleOpenCloseResponse } = useContext(ViewStatusContext);
  const currentQuestionRef = React.useRef(0);
  const findStudentData = (data, studentId) => {
    let isInclude = false;
    let i = 0;
    for (let item of data) {
      if (item.student_id == studentId) {
        isInclude = true;
        break;
      }
      i++;
    }

    if (isInclude) {
      let studentQuestionData = data[i]?.student_question_data || [];
      setTotalQuestionArray(studentQuestionData);
    } else setTotalQuestionArray([]);
  };
  const handleApi = async () => {
    let { data } = await viewQuestionStatusApi(practiceId);
    if (data.status) {
      findStudentData(data.results, identity.split("-")[0]);
      //   setTotalQuestionArray(data.total ? new Array(data?.total).fill(0) : []);
    }
  };
  React.useEffect(() => {
    handleApi();
  }, []);
  const findQuestion = (index, datas) => {
    if (index === 1) {
      let val = datas[currentQuestionRef.current]?.result_data[0];

      return val;
    } else if (index === 2) {
      return datas[currentQuestionRef.current]?.question_data[0]?.question_type;
    } else return datas[currentQuestionRef.current];
  };
  const handleShowQestion = (i) => {
    currentQuestionRef.current = i;
    let response = findQuestion(1, totalQuestionArray);
    let type = findQuestion(2, totalQuestionArray);
    let questionDatas = findQuestion(0, totalQuestionArray);
    handleOpenCloseResponse(true, i, { response, type, questionDatas });
  };
  useEffect(() => {
    return () => {
      handleOpenCloseResponse(false, -1, {});
    };
  }, []);
  const windowListner = () => {
    typeof handleWindowListener === "function" && handleWindowListener();
  };
  useEffect(() => {
    window.addEventListener("click", windowListner);
    return () => {
      window.removeEventListener("click", windowListner);
    };
  }, []);
  return (
    <>
      {totalQuestionArray.length ? (
        totalQuestionArray.map((item, i) =>
          (() => {
            let backgroundColor = "";
            let textColor = "";
            let result_data = item?.result_data || [];
            let objResponse = result_data[0] || {};
            let isCorrect = objResponse.hasOwnProperty("correct");
            isCorrect = isCorrect ? (objResponse.correct ? 1 : 0) : -1; //-1,0,1 for skipped, incorrect and correct question respectivelt
            switch (isCorrect) {
              case 0: {
                backgroundColor = "bg-F24A4A";
                textColor = "text-white";
                break;
              }
              case 1: {
                backgroundColor = "bg-27AE60";
                textColor = "text-white";
                break;
              }
              default: {
                backgroundColor = "";
                textColor =
                  item?.current_question === i + 1
                    ? "text-828282"
                    : "text-white";
                break;
              }
            }
            return (
              <div
                key={i}
                className={`${backgroundColor} ${textColor} w-7 h-7 rounded-full flex justify-center items-center ${
                  item?.current_question === i + 1
                    ? "border-white"
                    : "border-828282"
                } ${
                  item?.current_question === i + 1 ? "border-2" : "border-2"
                } border-solid`}
                onClick={(e) => {
                  e.stopPropagation();
                  item.current_question > i ? handleShowQestion(i) : "";
                }}
                style={{
                  cursor: item.current_question > i ? "pointer" : "initial",
                }}
              >
                {i + 1}
              </div>
            );
          })()
        )
      ) : (
        <div className="text-white">No Question Found...</div>
      )}
    </>
  );
}
