import React, { useEffect, useState } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { ViewStatusContext } from "../../Mathzone/mathzone";
import styles from "../../Mathzone/component/OnlineQuiz.module.css";
import ViewIncorrectQuestion from "./ViewIncorrectQuestion";
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
  const [exerciseId, setExcerciseId] = useState("");
  const handleClose = () => {
    handleCloseReviewResultStatus();
    setCurrentUserId("");
  };
  const handleOpenResponse = (id: string) => {
    if (identity == "tutor") {
      setExcerciseId(id);
      handleOpenReviewResultStatus(student);
    }
  };
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
  const filterReportData = () => {
    if (reportsData.length) setLastData(reportsData[reportsData.length - 1]);
  };
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
                    View
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
  ) : (
    <ViewIncorrectQuestion
      studentId={student?.id || ""}
      user_id={userId}
      onClick={handleClose}
      exerciseId={exerciseId}
      prepostId={lastData?.pre_post_test_id || ""}
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
