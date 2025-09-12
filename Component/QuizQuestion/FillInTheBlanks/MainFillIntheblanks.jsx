import React from "react";
import FillIntheBlanks from "./FillIntheBlanks";

export default function MainFillIntheblanks({ obj, wordsLength }) {
  let questionData = JSON.parse(obj?.question_data);
  return <FillIntheBlanks obj={questionData} wordsLength={wordsLength} />;
}
