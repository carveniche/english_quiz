import React, { useEffect } from "react";
import ReadingComprehensive from "./ReadingComprehensive";
import GroupQuestionContextProvider from "../ContextProvider/GroupContextProvider";
export default function MainReadingComprehensive({ data, showQuestion }) {
  let group_data = JSON.parse(data?.group_data?.question_text);
  return (
    <GroupQuestionContextProvider>
      <ReadingComprehensive
        group_data={group_data}
        question_data={data?.question_data || []}
        show_group_question={showQuestion}
      />
    </GroupQuestionContextProvider>
  );
}
