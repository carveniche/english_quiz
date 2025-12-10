import React, { useContext, useEffect, useRef, useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import {ValidationContextProvider } from "./QuizPage";
// import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
import styles from "../Component/outerPage.module.css";
import QuestionTracker from "./CommonComponent/QuestionTracker";
import SolutionSection from "./Solution/SolutionSection";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
export function QuizDisplay({ obj, showCorrectIncorrect, showSolution, data }) {
  return (
    <>
      <ValidationContextProvider key={obj?.question_id} isshowSolution={showSolution} isreadOut={obj?.read_out}>
        <Allfile data={obj} questionData={data} />
      </ValidationContextProvider>
    </>
  );
}
export default function GroupFile({
  fromPage,
  data,
  isShowQuestion,
  showSolution,
  showCorrectIncorrect,
}) {

  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionState, setShowSolutionState] = useState(false);

  window.handleSolutionToggle = setShowSolutionState;
  const groupComponent = React.useMemo(() => {
   
    if (!data?.group_type) return null;
    const map = {
      "Reading Comprehension":<MainReadingComprehensive data={data} showQuestion={true} />,
      "Listening": <MainListening data={data} showQuestion={true} />,
    };
    return map[data.group_type] || null;
  }, [data?.group_type]); // ✅ only recompute when group_type changes

  const mainContainerRef = useRef(null);

 

  return (
    <ValidationContextProvider>
      <div
       ref={mainContainerRef}
        className={`${styles.main_layout_section} ${
          fromPage === "Review" ? "![position:unset]" : ""
        }`}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {data?.group_type && (
          <div className={styles.group_container}>{groupComponent}</div>
        )}

        <div
          className={`${styles.question_container} ${data?.group_type ? styles.group_active : ""
            }`}
        >
          {data?.group_type && data.question_data.length > 0 && (
            <QuestionTracker data={data} />
          )}

          <div className={`${styles.question_section} scroll__bar`}>
           
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
              className={`${styles.solution_button} btn_txt_s `}

            >
              Show Answer
            </button>
          )
        }

        <SolutionSection
          open={showSolutionModal}
          setClose={setShowSolutionModal}
          obj={data?.question_data[0]}
          question_type={data?.question_data[0]?.question_type}

        />
        <CorrectIncorrectStatus obj={data?.question_data[0]} />

      </div>
    </ValidationContextProvider>

  );
}


