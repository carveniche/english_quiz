import { useContext, useEffect } from "react";
import MainFillInTheBlanks from "../component/FillInTheBlacks/MainFillInTheBlanks";
import HorizontalPreviewClick from "../component/HorizontalPreviewClick";
import MainMultipleChoice from "../component/MultipleChoice/MainMultipleChoice";
import MainMultipleSelect from "../component/MultipleSelect/MainMultipleSelect";
import DisabledTeacherCkEditor from "../component/TeacherOnlineQuiz/component/AllDisabledQuestion/Ckeditor/DisabledTeacherCkEditor";
import jsonDataTesting from "../component/TestingData";
import { ValidationContext } from "../MainOnlineQuiz/MainOnlineQuizPage";

export default function QuestionWithNoHtmlContent({
  type,
  choicesId,
  obj,
  studentResponse,
}) {
  const { handleUpdateStudentAnswerResponse } = useContext(ValidationContext);

  useEffect(() => {
    handleUpdateStudentAnswerResponse(true);
    return () => {
      handleUpdateStudentAnswerResponse(true);
    };
  }, []);
  let questionType = {
    "Multiple choice": (
      <MainMultipleChoice obj={obj} meter={-1} choiceId={choicesId} />
    ),
    "True/False": (
      <MainMultipleChoice obj={obj} meter={-1} choiceId={choicesId} />
    ),
    "Fill in the blanks": (
      <MainFillInTheBlanks obj={obj} meter={-1} choiceId={choicesId} />
    ),
    "multi select": (
      <MainMultipleSelect obj={obj} meter={-1} choiceId={choicesId} />
    ),
    ckeditor: (
      <DisabledTeacherCkEditor
        str={studentResponse || ""}
        meter={-1}
        choiceData={obj?.question_data[0]?.choice_data}
        choiceId={choicesId}
        upload_file_name={obj?.question_data[0]?.upload_file_name}
      />
    ),
  };
  return <>{questionType[type]}</>;
}
