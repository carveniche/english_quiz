import React from "react";
import FillIntheBlanks from "./FillIntheBlanks";

export default function MainFillIntheblanks({ obj, wordsLength }) {
  const questionData = useMemo(() => {
    return JSON.parse(obj?.question_data);
  }, [obj?.question_data]);
  return <FillIntheBlanks obj={questionData} wordsLength={wordsLength} />;
}
