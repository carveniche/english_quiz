import React from "react";
import Reordering from "./Reordering";

export default function MainReordering({ obj, direction, wordsLength }) {
 
  let questionData = JSON.parse(obj?.question_data);

  
  let questionResponse = null;
  try {
    if(obj?.questionResponse){
    questionResponse = JSON.parse(obj?.questionResponse);
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <>
      <Reordering
        obj={questionData}
        direction={direction}
        questionResponse={questionResponse}
        wordsLength={wordsLength}
      />
    </>
  );
}
