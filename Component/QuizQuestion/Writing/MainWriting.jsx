import React from "react";
import Writing from "./Writing";

export default function MainWriting({ obj }) {
  let question_text = JSON.parse(obj?.question_data);
  return (
    <>
      <Writing questionData={question_text} />
    </>
  );
}
