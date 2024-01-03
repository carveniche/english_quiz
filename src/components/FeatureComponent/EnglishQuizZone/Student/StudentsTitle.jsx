import { useSelector } from "react-redux";
export default function StudentsTitle({
  isQuizCompleted,
  currentQuestion,
  totalQuestion,
  obj,
}) {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const selectedTab = activeTabArray[currentSelectedIndex];

  const { extraParams } = selectedTab || {};
  return (
    <div
      className={`flex bg-F5F5F5 ${
        isQuizCompleted ? "justify-between" : "justify-between "
      } px-4 py-2 items-center`}
    >
      <div style={{ visibility: totalQuestion ? "visible" : "hidden" }}>
        Q. {currentQuestion} / {totalQuestion}
      </div>

      <div>
        {extraParams?.conceptName} - {extraParams?.level}
      </div>
    </div>
  );
}
