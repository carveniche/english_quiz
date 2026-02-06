import React, { useContext } from "react";
import Writing from "./Writing";
import { WRITING_GPT } from "../../Utility/Constant";

export default function MainWriting({ obj, wordsLength, questionData }) {
  let question_text = JSON.parse(obj?.question_data);
  let questionResponse = null;
  
  try {
   questionResponse = obj[WRITING_GPT.questionResponse] ?? null;

  if (typeof questionResponse === "string") {
    try {
      const parsed = JSON.parse(questionResponse);
      // Only assign if parsed is an object or array
      if (parsed && typeof parsed === "object") questionResponse = parsed;
    } catch {
      // Keep as string if not valid JSON
      console.warn("questionResponse is not valid JSON string:", questionResponse);
    }
  }

  // questionResponse is now either an object, array, string, or null
} catch (e) {
  console.error(e);
}

  return (
    <>
      <Writing
        questionGroupData={questionData}
        questionData={question_text}
        wordsLength={wordsLength}
        questionResponse={questionResponse}
      />
    </>
  );
}
