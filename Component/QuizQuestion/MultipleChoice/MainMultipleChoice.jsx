import MultipleChoice from "./MultipleChoice";

export default function MainMultipleChoice({ obj }) {
  let questionData = JSON.parse(obj?.question_data);
  return <MultipleChoice obj={questionData} />;
}
