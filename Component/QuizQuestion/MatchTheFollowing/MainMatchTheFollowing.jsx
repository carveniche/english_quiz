import React from "react";
import MatchTheFollowing from "./MatchTheFollowing";

export default function MainMatchTheFollowing({ obj, wordsLength }) {
  let questionData = JSON.parse(obj?.question_data);
  return <MatchTheFollowing obj={questionData} wordsLength={wordsLength} />;
}
