import React from "react";
import Writing from "./Writing";
import { WRITING_GPT } from "../../Utility/Constant";

export default function MainWriting({ obj, wordsLength }) {
  let question_text = JSON.parse(obj?.question_data);
  let questionResponse = null;
  try {
    questionResponse = obj[WRITING_GPT.questionResponse] || null;
    questionResponse = JSON.parse(questionResponse);
  } catch (e) {
    console.log(e);
  }
  return (
    <>
      <Writing
        questionData={question_text}
        wordsLength={wordsLength}
        questionResponse={questionResponse}
      />
    </>
  );
}
