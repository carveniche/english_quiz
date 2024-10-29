import React, { useEffect, useState } from "react";
import MainMultipleChoice from "./QuizQuestion/MultipleChoice/MainMultipleChoice";
import MainFillIntheblanks from "./QuizQuestion/FillInTheBlanks/MainFillIntheblanks";
import MainReordering from "./QuizQuestion/reordering/MainReordering";
import MainWriting from "./QuizQuestion/Writing/MainWriting";
import MainMatchTheFollowing from "./QuizQuestion/MatchTheFollowing/MainMatchTheFollowing";
import { Main_Speaking_Type } from "./QuizQuestion/Speaking_type/Main_Speaking_Type";

export default function Allfile({ data, questionData }) {
  const [wordsLength, setWordsLength] = useState(0);
  let questionType = {
    "Multiple choice": (
      <MainMultipleChoice wordsLength={wordsLength} obj={data} />
    ),
    "Fill in the blanks": (
      <MainFillIntheblanks wordsLength={wordsLength} obj={data} />
    ),
    "Horizontal Ordering": (
      <MainReordering
        wordsLength={wordsLength}
        obj={data}
        direction={"horizontal"}
      />
    ),
    "Vertical Ordering": (
      <MainReordering
        wordsLength={wordsLength}
        obj={data}
        direction={"vertical"}
      />
    ),
    "Writing ChatGpt": (
      <MainWriting
        questionData={questionData}
        wordsLength={wordsLength}
        obj={data}
      />
    ),
    "Math the Following": (
      <MainMatchTheFollowing wordsLength={wordsLength} obj={data} />
    ),
    read_the_text: <Main_Speaking_Type wordsLength={wordsLength} obj={data} />,
  };
  const getQuestionId = () => {
    return data?.question_id;
  };
  useEffect(() => {
    if (data.question_data) {
      var wordsLength = JSON.parse(data.question_data)?.questionName.reduce(
        (acc, node) =>
          node.node == "text" && node.value
            ? acc + node.value.split(" ").length
            : acc,
        0
      );
      setWordsLength(wordsLength);
    }
  }, []);
  window.getQuestionId = getQuestionId;
  return <>{questionType[data?.question_type] || "Yet to be Released"}</>;
}
