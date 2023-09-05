import { useSelector } from "react-redux";
export default function StudentsTitle({
  isQuizCompleted,
  currentQuestion,
  totalQuestion,
  obj,
  isPrepostTest,
  onClick,
}) {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];
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
        {extraParams?.conceptName} - {extraParams?.tagName}{" "}
        {isPrepostTest ? "" : "Level-"}
        {isPrepostTest ? "" : extraParams?.level}
      </div>
      {isPrepostTest ? (
        <>
          <div
            onClick={onClick}
            className="cursor-pointer h-7 flex justify-center items-center py-1 px-3 border-black rounded-2xl bg-white border-black border-solid border-2"
          >
            Skip
          </div>
        </>
      ) : (
        <div style={{ minWidth: 10, visibility: "hidden" }}>dddd</div>
      )}
    </div>
  );
}
