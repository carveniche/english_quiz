import React, { useContext, useEffect, useRef, useState } from "react";

import styles from "../Mathzone/component/OnlineQuiz.module.css";
import FlagQuestionContextProvider, {
  FlagQuestionContext,
} from "./ContextProvider/FlagQuestionContextProvider";
import FlagQuestionPagination from "./FlagQuestionPagination/FlagQuestionPagination";
import { fetchFlagQuestion, markAsResolvedFlagQuestion } from "../../../api";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import { TeacherQuizDisplay } from "../Mathzone/MainOnlineQuiz/MainOnlineQuizPage";
import handleResizeWidth from "../Mathzone/handleResizeWidth";

const FlagQuestionViewer = (props) => {
  const [data, setData] = useState([]);
  const heightRef = useRef();
  const [currentHeight, setCurrentHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    updateTotalQuestionReview,
    currentQuestionReview,
    totalReviewResult,
    handlePaginationRevieResult,
    questionDemount,
  } = useContext(FlagQuestionContext);
  const fetchData = async (conceptId, liveClassId, tagId) => {
    try {
      setLoading(true);
      const { data } = await fetchFlagQuestion(conceptId, liveClassId, tagId);
      setLoading(false);
      console.log(data);
      if (data?.status) {
        setData(data?.result_data || []);
        updateTotalQuestionReview(data?.result_data?.length || 0);
        return data?.result_data || [];
      } else {
        setData([]);
        // typeof props?.fetchFlaggedQuestionList === "function" &&
        // props.fetchFlaggedQuestionList();
      }
      return [];
    } catch (e) {
      setData([]);
      setLoading(false);
      console.log(e);
      // typeof props?.fetchFlaggedQuestionList === "function" &&
      //   props.fetchFlaggedQuestionList();
      return [];
    }
  };
  useEffect(() => {
    if (props?.identity === "tutor")
      fetchData(props?.conceptId, props?.liveClassId, props?.flagTagId);

    return () => {};
  }, []);
  useEffect;
  const studentFetchingDatas = async () => {
    console.log("calling");
    await fetchData(props?.conceptId, props?.liveClassId, props?.flagTagId);

    // handlePaginationRevieResult(props?.currentFlagQuestion);
  };
  useEffect(() => {
    if (props.identity !== "tutor" && props?.isFetchAgain) {
      console.log;
      studentFetchingDatas();
    }
  }, [props?.currentFetchTime]);

  const handleMarkAsCompleted = async () => {
    try {
      setLoading(true);
      let flagged_question_id =
        data[currentQuestionReview]?.flagged_question_id;
      console.log(flagged_question_id);
      await markAsResolvedFlagQuestion(
        flagged_question_id,
        props?.currentUserId
      );
      let datas = await fetchData(
        props?.conceptId,
        props?.liveClassId,
        props?.flagTagId
      );
      console.log(datas);
      if (datas?.length <= currentQuestionReview) {
        handlePaginationRevieResult(datas?.length - 1 || 0);
      } else {
        handlePaginationRevieResult(currentQuestionReview);
      }
      typeof props?.handleFlagQuestionChange == "function" &&
        props?.handleFlagQuestionChange(
          datas?.length <= currentQuestionReview
            ? datas?.length - 1 || 0
            : currentQuestionReview,
          true
        );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleResizeWidth(heightRef.current, setCurrentHeight);
    window.addEventListener("resize", () => {
      setTimeout(() => {
        handleResizeWidth(heightRef.current, setCurrentHeight);
      }, 500);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setTimeout(() => {
          handleResizeWidth(heightRef.current, setCurrentHeight);
        }, 500);
      });
    };
  }, []);
  return (
    <>
      <div
        className={`${styles.mainPage} h-full w-full m-0`}
        style={{ margin: 0, padding: 0, width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            padding: 0,
            margin: 0,
            height: "fit-content",
          }}
          ref={heightRef}
        >
          {props?.identity === "tutor" && data?.length > 0 && (
            <div
              className={styles.paginationContainer}
              style={{ marginTop: 5 }}
            >
              {totalReviewResult ? (
                <FlagQuestionPagination
                  handleFlagQuestionChange={props?.handleFlagQuestionChange}
                />
              ) : (
                ""
              )}
            </div>
          )}
          {!props?.obj?.quiz_completed && (
            <div
              className={`flex bg-ffffff ${
                true ? "justify-between " : "justify-between "
              } px-4 py-2 items-center`}
            >
              {data?.length > 0 && (
                <div className={styles.mathZoneQuestionNo}>
                  Q. {currentQuestionReview + 1} of {totalReviewResult}
                </div>
              )}
              <div className={styles.mathZonetitle}>
                {props?.conceptName || "Addition"}&nbsp; - &nbsp;
                {props?.flagTagName || ""}{" "}
              </div>
              {props?.identity === "tutor" && !loading && data?.length > 0 && (
                <div
                  className={styles.nextBtnContainer}
                  style={{ width: "180px" }}
                >
                  <button
                    id="ooooooo"
                    className={styles.NextButton}
                    style={{ width: "180px" }}
                    onClick={handleMarkAsCompleted}
                  >
                    Mark as resolved
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <QuizPageLayout height={currentHeight}>
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              width: "calc(100% - 160px)",
              maxHeight: `calc(100% - ${"tutor" ? 0 : 0}px)`,
              minHeight: `calc(100% - ${"tutor" ? 0 : 0}px)`,
            }}
          >
            <QuizWhitePage>
              {props?.identity === "tutor" && (
                <div
                  style={{ position: "relative", marginBottom: 26 }}
                  className={styles.closeButton}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      cursor: "pointer",
                    }}
                  >
                    <a onClick={props.handleCloseQuestion}>Close</a>
                  </div>
                </div>
              )}
              {questionDemount ? (
                <>
                  {(() => {
                    let currentIndex = 0;
                    currentIndex =
                      props?.identity == "tutor"
                        ? currentQuestionReview
                        : props?.currentQuestion;
                    return (
                      data[currentIndex] && (
                        <TeacherQuizDisplay
                          obj={data[currentIndex]}
                          showSolution={false}
                        />
                      )
                    );
                  })()}
                </>
              ) : (
                <h1>Loading...</h1>
              )}
            </QuizWhitePage>
          </div>
        </QuizPageLayout>
      </div>
    </>
  );
};
export default function FlagQuestion(props) {
  return (
    <>
      <FlagQuestionContextProvider>
        <FlagQuestionViewer {...props} />
      </FlagQuestionContextProvider>
    </>
  );
}
