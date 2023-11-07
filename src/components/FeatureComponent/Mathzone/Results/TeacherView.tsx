import React, { useEffect, useState } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { ViewStatusContext } from "../mathzone";
import styles from "../component/OnlineQuiz.module.css";
import { StudentResultMathZone } from "../../../../api";
import ViewIncorrectQuestion from "./ViewIncorrectQuestion";
import { MATHZONEDATAKEY } from "../../../../constants";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
export default function TeacherView({
  practiceId,
  conceptName,
  conceptTag,
  userId,
}) {
  const [data, setData] = useState([]);
  const { room } = useVideoContext();
  useEffect(() => {
    getStudentResult(practiceId, userId);
    handleCloseReviewResultStatus();
  }, []);
  const getStudentResult = async (live_class_practice_id, user_id) => {
    try {
      let result = await StudentResultMathZone({
        live_class_practice_id,
        user_id,
      });
      setData(result?.data?.result_data);
    } catch (e) {
      console.log("error in api", e);
    }
  };
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state: RootState) => state.activeTabReducer);
  const handleClose = () => {
    let obj = {
      openCurrentQuestion: false,
      practiceId: "",
      tutorId: "",
      currentUserId: "",
      mathzoneKeys: MATHZONEDATAKEY.viewIncorrectQuestion,
    };
    handleDataTrack({ data: obj }, "");
    handleCloseReviewResultStatus();
    setCurrentUserId("");
  };
  const handleDataTrack = (data, identity) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let activeTabData = activeTabArray[currentSelectedIndex];
    console.log(data);
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: MATHZONEDATAKEY.viewIncorrectQuestion,
        identity: null,
        data: data?.data || {},
        activeTabData,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const handleOpenResponse = (id) => {
    setCurrentUserId(id);
    let obj = {
      openCurrentQuestion: true,
      practiceId: practiceId,
      tutorId: userId,
      currentUserId: id,
      mathzoneKeys: MATHZONEDATAKEY.viewIncorrectQuestion,
    };
    handleDataTrack({ data: obj }, "");
    handleOpenReviewResultStatus();
  };
  const handleDataTrackForPageChange = (currentIndex: number) => {
    let obj = {
      openCurrentQuestion: true,
      practiceId: practiceId,
      tutorId: userId,
      currentUserId: currentUserId,
      mathzoneKeys: MATHZONEDATAKEY.viewIncorrectQuestion,
      currentIndex: currentIndex,
    };
    handleDataTrack({ data: obj }, "");
  };
  const [currentUserId, setCurrentUserId] = useState("");
  const {
    handleCloseReviewResultStatus,
    handleOpenReviewResultStatus,
    reviewResultStatus,
  } = useContext(ViewStatusContext);
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
        <div className="borderRight bgColor textColor">
          <a>Student Name</a>
        </div>
        <div className="borderRight bgColor textColor">Total Questions</div>
        <div className="borderRight bgColor textColor">Skipped Questions</div>
        <div className="borderRight bgColor textColor">Correct </div>
        <div className="borderRight bgColor textColor">Incorrect </div>
        <div className="bgColor textColor">Score</div>

        {data?.map((item, i) => (
          <>
            <div className="borderRight borderTop">{item?.name}</div>
            <div className="borderRight borderTop">{item?.total || 0}</div>
            <div className="borderRight borderTop">{item?.skipped || 0}</div>
            <div className="borderRight borderTop">{item?.correct}</div>
            <div
              className="borderRight borderTop pointer"
              onClick={() =>
                item?.incorrect ? handleOpenResponse(item.user_id) : ""
              }
            >
              {item?.incorrect}
            </div>
            <div className="borderTop ">{item?.score}</div>
          </>
        ))}
      </Grid>
    </div>
  ) : (
    <ViewIncorrectQuestion
      practiceId={practiceId}
      id={currentUserId}
      user_id={userId}
      onClick={handleClose}
      identity="tutor"
      handleDataTrack={handleDataTrackForPageChange}
    />
  );
}

const Grid = styled.div`
  display: grid;
  width: 90%;
  margin-top: 1rem;
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
    text-align: center;
  }
  > .borderRight {
    border-right: 0;
  }
  > .borderTop {
    border-top: 0;
  }
  > .flexBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  > .flexBox > button {
    margin-right: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  > .pointer {
    color: red;
    cursor: pointer;
  }
  > .bgColor {
    background-color: deepskyblue;
  }
  > .textColor {
    color: white;
  }
`;
