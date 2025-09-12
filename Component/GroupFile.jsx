import React, { useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import { ValidationContextProvider } from "./QuizPage";
// import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
import styles from "../Component/outerPage.module.css";
import QuestionTracker from "./CommonComponent/QuestionTracker";
import SolutionSection from "./Solution/SolutionSection";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
export function QuizDisplay({ obj, showCorrectIncorrect, showSolution, data }) {
  return (
    <>
      <ValidationContextProvider key={obj?.question_id} showSolution={showSolution} readOut={obj?.read_out}>
        <Allfile data={obj} questionData={data} />

        {/* <CorrectIncorrectStatus
          showCorrectIncorrect={showCorrectIncorrect}
          showSolution={showSolution}
          obj={obj}
        /> */}

          


      </ValidationContextProvider>
    </>
  );
}
export default function GroupFile({
  data,
  isShowQuestion,
  showSolution,
  showCorrectIncorrect,
}) {
  const [showQuestion, setShowQuestion] = useState(isShowQuestion || false);
  window.setShowQuestion = setShowQuestion;
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionState, setShowSolutionState] = useState(false);

  window.handleSolutionToggle = setShowSolutionState;
  const groupComponent = React.useMemo(() => {
    if (!data?.group_type) return null;

    const map = {
      "Reading Comprehension": (
        <MainReadingComprehensive data={data} showQuestion={isShowQuestion} />
      ),
      "Listening": <MainListening data={data} showQuestion={isShowQuestion} />,
    };

    return map[data.group_type] || null;
  }, [data?.group_type]); // ✅ only recompute when group_type changes

  return (
    <div
      className={styles.main_layout_section}
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {data?.group_type && (
        <div className={styles.group_container}>{groupComponent}</div>
      )}

      <div
        className={`${styles.question_container} ${
          data?.group_type ? styles.group_active : ""
        }`}
      >
        {data?.group_type && data.question_data.length > 0 && (
          <QuestionTracker data={data} />
        )}

        <div className={styles.question_section}>
          <QuizDisplay
            obj={data?.question_data[0] || ""}
            data={data}
            showCorrectIncorrect={showCorrectIncorrect}
            showSolution={showSolution}
          />
        </div>
      </div>

      {
        (showSolution || showSolutionState) && (
          <button
            onClick={() => setShowSolutionModal(true)}
            className={styles.solution_button}
          >
            Solution
          </button>
        )
      }

         <SolutionSection
          open={showSolutionModal}
          setClose={setShowSolutionModal}
          obj={data?.question_data[0]}
          question_type={data?.question_data[0]?.question_type}
         
        />
      <CorrectIncorrectStatus />

    </div>
  );
}


