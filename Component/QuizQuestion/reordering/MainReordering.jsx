import React from "react";
import Reordering from "./Reordering";

export default function MainReordering({ obj, direction }) {
  let questionData = JSON.parse(obj?.question_data);
  return (
    <>
      <Reordering obj={questionData} direction={direction} />
    </>
  );
}
