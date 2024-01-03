import React, { useEffect, useState } from "react";
import GroupFile from "./english_zone_question/Component/GroupFile";
import TimerClock from "../Mathzone/MainOnlineQuiz/TimerClock";
import SolveButton from "./SolveButton";
import { studentAnswerEnglishResponse } from "../../../api/englishApi";

export default function RenderedQuestion({
  obj,
  showQuestion,
  identity,
  studentId,
  live_class_id,
  details,
}) {
  const [hasAnswerSubmitted, setHasAnswerSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const handleSubmit = () => {
    let value = window.handleSubmitReactQuestion();
    if (value == 0 || value == 1) {
      setHasAnswerSubmitted(true);
    }
  };
  const handleSavedApi = async () => {
    if (identity === "tutor") return;
    try {
      let obj = window.handleCheckStudentResponse();
      let formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("question_id", details?.question_id);
      formData.append(
        "english_live_practice_id",
        details?.live_class_practice_id
      );
      formData.append("objective_id", details?.objective_id);
      formData.append("new_level_id", details?.new_level_id);
      formData.append("english_quiz_id", 1);
      formData.append("live_class_id", live_class_id);
      formData.append("correct", obj?.isCorrect === 1 ? true : false);
      formData.append("student_response", obj?.studentAnswer);
      formData.append("time_spent", count);
      formData.append("skipped", false);
      await studentAnswerEnglishResponse(formData);
    } catch (e) {}
  };
  useEffect(() => {
    if (hasAnswerSubmitted) handleSavedApi();
  }, [hasAnswerSubmitted]);
  return (
    <>
      {identity !== "tutor" && (
        <>
          <TimerClock count={count} />

          <SolveButton
            onClick={handleSubmit}
            hasAnswerSubmitted={hasAnswerSubmitted}
          />
        </>
      )}
      <div>
        <GroupFile data={obj} isShowQuestion={showQuestion} />
      </div>
    </>
  );
}
