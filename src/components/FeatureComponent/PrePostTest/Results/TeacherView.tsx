import React, { useEffect, useState } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { ViewStatusContext } from "../../Mathzone/mathzone";
import styles from "../../Mathzone/component/OnlineQuiz.module.css";
import ViewIncorrectQuestion from "./ViewIncorrectQuestion";
import { PREPOSTTESTKEY } from "../../../../constants";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openCloseIncorrectPrePostQuestion } from "../../../../redux/features/ComponentLevelDataReducer";
export default function TeacherView({
  practiceId,
  conceptName,
  conceptTag,
  userId,
  reportsData,
  student,
  identity,
}) {
  useEffect(() => {
    handleCloseReviewResultStatus();
  }, []);
  const { room } = useVideoContext();
  const [exerciseId, setExcerciseId] = useState("");
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state: RootState) => state.activeTabReducer);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const viewResultData = otherData[PREPOSTTESTKEY.viewIncorrectQuestion] || {};
  const handleClose = () => {
    handleCloseReviewResultStatus();
    setCurrentUserId("");
    let obj = {
      openCurrentQuestion: false,
      exerciseId: "",
      tutorId: "",
      currentUserId: "",
      prePostTestId: "",
      mathzoneKeys: PREPOSTTESTKEY.viewIncorrectQuestion,
      fromPrePostTest: true,
    };
    handleDataTrack({ data: obj }, "");
  };
  const handleDataTrack = (data, identity) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let activeTabData = activeTabArray[currentSelectedIndex];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: PREPOSTTESTKEY.viewIncorrectQuestion,
        identity: null,
        data: data?.data || {},
        activeTabData,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const handleOpenResponse = (id: string) => {
    if (identity == "tutor") {
      setExcerciseId(id);
      handleOpenReviewResultStatus(student);
      let obj = {
        openCurrentQuestion: true,
        exerciseId: id,
        tutorId: userId,
        currentUserId: student?.id,
        prePostTestId: lastData?.pre_post_test_id || "",
        mathzoneKeys: PREPOSTTESTKEY.viewIncorrectQuestion,
        fromPrePostTest: true,
      };
      handleDataTrack({ data: obj }, "");
    }
  };
  const dispatch = useDispatch();
  const [lastData, setLastData] = useState({});
  const [currentUserId, setCurrentUserId] = useState("");
  const {
    handleCloseReviewResultStatus,
    handleOpenReviewResultStatus,
    reviewResultStatus,
  } = useContext(ViewStatusContext);
  useEffect(() => {
    filterReportData();
  }, []);

  useEffect(() => {
    if (identity === "tutor") return;
    if (viewResultData?.isOpenViewIncorrectResult)
      handleOpenReviewResultStatus();
    else {
      handleCloseReviewResultStatus();
    }
  }, [viewResultData?.isOpenViewIncorrectResult]);
  const filterReportData = () => {
    if (reportsData.length) setLastData(reportsData[reportsData.length - 1]);
  };
  const handleDataTrackForPageChange = (currentIndex: number) => {
    let obj = {
      openCurrentQuestion: true,
      exerciseId: viewResultData?.exerciseId,
      tutorId: userId,
      currentUserId: student?.id,
      prePostTestId: lastData?.pre_post_test_id || "",
      mathzoneKeys: PREPOSTTESTKEY.viewIncorrectQuestion,
      fromPrePostTest: true,
      currentIndex,
    };
    handleDataTrack({ data: obj }, "");
  };
  useEffect(() => {
    return () => {
      let obj = {
        openCurrentQuestion: false,
        exerciseId: "",
        tutorId: "",
        currentUserId: "",
        prePostTestId: "",
        mathzoneKeys: PREPOSTTESTKEY.viewIncorrectQuestion,
        fromPrePostTest: true,
      };
      if (identity !== "tutor")
        dispatch(openCloseIncorrectPrePostQuestion(obj));
    };
  }, []);
  return !reviewResultStatus ? (
    <div>
      <div className={styles.title2}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold !important",
          }}
          id={styles.titleStatus}
        >
          Result Status
        </div>
      </div>
      <Grid>
        <div
          style={{ textAlign: "center" }}
          className="borderRight bgColor textColor"
        >
          <a>Tags</a>
        </div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight bgColor textColor"
        >
          Score
        </div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight bgColor textColor"
        >
          Time spent
        </div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight bgColor textColor"
        >
          Skipped Count
        </div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight bgColor textColor"
        >
          Incorrect Count
        </div>
        <div style={{ textAlign: "center" }} className="bgColor textColor">
          View Skipped/Incorrect questions
        </div>

        <div style={{ textAlign: "center" }} className="borderRight borderTop">
          Over All
        </div>
        <div style={{ textAlign: "center" }} className="borderRight borderTop">
          {lastData?.over_all_correct} /{lastData?.over_all_total}{" "}
        </div>
        <div style={{ textAlign: "center" }} className="borderRight borderTop">
          {lastData?.over_all_time_spent}
        </div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight borderTop"
        ></div>
        <div
          style={{ textAlign: "center" }}
          className="borderRight borderTop"
        ></div>
        <div style={{ textAlign: "center" }} className="borderTop"></div>

        {reportsData?.map(
          (item, i) =>
            Boolean(i < reportsData.length - 1) && (
              <React.Fragment key={i}>
                <div
                  style={{ textAlign: "center" }}
                  className="borderRight borderTop"
                >
                  {item?.name}
                </div>
                <div
                  style={{ textAlign: "center" }}
                  className="borderRight borderTop"
                >
                  {item.correct} / {item.total}
                </div>
                <div
                  style={{ textAlign: "center" }}
                  className="borderRight borderTop"
                >
                  {item?.time_spent}
                </div>
                <div
                  style={{ textAlign: "center" }}
                  className="borderRight borderTop"
                >
                  {item?.skipped}
                </div>
                <div
                  style={{ textAlign: "center" }}
                  className="borderRight borderTop"
                >
                  {item?.incorrect}
                </div>
                {item?.incorrect != "-" || item?.skipped != "-" ? (
                  <div
                    className="borderTop pointer"
                    style={{
                      color: "red",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => handleOpenResponse(item.id)}
                  >
                    {identity === "tutor" ? "View" : ""}
                  </div>
                ) : (
                  <div
                    className="borderTop pointer"
                    style={{ color: "red", textAlign: "center" }}
                  >
                    {item?.incorrect}
                  </div>
                )}
              </React.Fragment>
            )
        )}
      </Grid>
    </div>
  ) : identity === "tutor" ? (
    <ViewIncorrectQuestion
      studentId={student?.id || ""}
      user_id={userId}
      onClick={handleClose}
      exerciseId={exerciseId}
      prepostId={lastData?.pre_post_test_id || ""}
      identity={"tutor"}
      currentIndex={0}
      handleDataTrack={handleDataTrackForPageChange}
    />
  ) : (
    <ViewIncorrectQuestion
      studentId={viewResultData?.currentUserId || ""}
      user_id={viewResultData?.tutorId || ""}
      onClick={() => {}}
      exerciseId={viewResultData?.exerciseId || ""}
      prepostId={viewResultData?.prePostTestId || ""}
      identity={"student"}
      currentIndex={viewResultData?.currentIndex || 0}
      handleDataTrack={() => {
        null;
      }}
    />
  );
}

const Grid = styled.div`
  display: grid;
  width: 90%;
  margin-top: 0.4rem;
  margin-left: 4%;
  margin-right: 6%;
  grid-template-columns: repeat(6, 1fr);
  word-break: break;
  > div {
    border: 1px solid black;
    padding: 0.2rem;
    justify-content: center;
    align-items: center;
    display: flex;
    font-weight: 400;
    font-size: 16px;
    word-break: break;
  }
  > .borderRight {
    border-right: 0;
  }
  > .borderTop {
    border-top: 0;
  }
  > .bgColor {
    background-color: deepskyblue;
  }
  > .textColor {
    color: white;
  }
`;
