import React from "react";
import MatchTheFollowing from "./MatchTheFollowing";

export default function MainMatchTheFollowing({ obj, wordsLength }) {
  let questionData = JSON.parse(obj?.question_data);
  // console.log(questionData);
  return <MatchTheFollowing obj={questionData} wordsLength={wordsLength} />;
}
