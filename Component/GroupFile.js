import React, { useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import { ValidationContextProvider } from "./QuizPage";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
export function QuizDisplay({ obj }) {
  return (
    <>
      <ValidationContextProvider key={obj?.question_id}>
        <Allfile data={obj} />
        <CorrectIncorrectStatus />
      </ValidationContextProvider>
    </>
  );
}
export default function GroupFile({ data }) {
  let groupObject = {
    "Reading Comprehension": <MainReadingComprehensive data={data} />,
    Listening: <MainListening data={data} />,
  };
  const [showQuestion, setShowQuestion] = useState(true);
  window.setShowQuestion = setShowQuestion;
  return (
    <>
      {groupObject[data?.group_type]}
      {showQuestion && (
        <div style={{ marginTop: 10 }}>
          <QuizDisplay obj={data?.question_data[0] || ""} />
        </div>
      )}
    </>
  );
}
