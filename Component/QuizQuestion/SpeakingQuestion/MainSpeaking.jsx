import React from "react";
import { WRITING_GPT } from "../../Utility/Constant";
import Speaking from "./Speaking";
export default function MainSpeaking({ obj }) {
  let question_text = JSON.parse(obj?.question_data);
  let questionResponse=null;
  try{
    questionResponse=obj[WRITING_GPT.questionResponse]||null
    questionResponse=JSON.parse(questionResponse)
  }
  catch(e){
    console.log(e)

  }
  return (
    <>
      <Speaking questionData={question_text} questionResponse={questionResponse}/>
    </>
  );
}
