import React from "react";
import MainMultipleChoice from "./QuizQuestion/MultipleChoice/MainMultipleChoice";
import MainFillIntheblanks from "./QuizQuestion/FillInTheBlanks/MainFillIntheblanks";
import MainReordering from "./QuizQuestion/reordering/MainReordering";
import MainWriting from "./QuizQuestion/Writing/MainWriting";
import MainMatchTheFollowing from "./QuizQuestion/MatchTheFollowing/MainMatchTheFollowing";
import MainSpeaking from "./QuizQuestion/SpeakingQuestion/MainSpeaking";

export default function Allfile({ data }) {
  let questionType = {
    "Multiple choice": <MainMultipleChoice obj={data} />,
    "Fill in the blanks": <MainFillIntheblanks obj={data} />,
    "Horizontal Ordering": (
      <MainReordering obj={data} direction={"horizontal"} />
    ),
    "Vertical Ordering": <MainReordering obj={data} direction={"vertical"} />,
    "Writing ChatGpt": <MainWriting obj={data} />,
    "Math the Following": <MainMatchTheFollowing obj={data} />,
    "Speaking":<MainSpeaking obj={data}/>
  };
  const getQuestionId = () => {
    return data?.question_id;
  };
  window.getQuestionId = getQuestionId;
  return <>{questionType[data?.question_type] || "Yet to be Released"}</>;
}
