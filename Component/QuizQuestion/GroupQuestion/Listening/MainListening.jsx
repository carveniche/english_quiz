import React from "react";
import Listening from "./Listening";
import GroupQuestionContextProvider from "../ContextProvider/GroupContextProvider";

export default function MainListening({ data }) {
  let group_data = JSON.parse(data?.group_data?.question_text, showQuestion);
  return (
    <>
      <GroupQuestionContextProvider>
        <Listening
          group_data={group_data}
          question_data={data?.question_data || []}
          show_group_question={showQuestion}
        />
      </GroupQuestionContextProvider>
    </>
  );
}
