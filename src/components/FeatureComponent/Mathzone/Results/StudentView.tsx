import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import styles from "../component/OnlineQuiz.module.css";
import { StudentResultMathZone } from "../../../../api";
import ChildHappyAnimation from "../../../LottieTransformation/ChildHappyAnimation";
import VictoryAnimation from "../../../LottieTransformation/VictoryAnimation";
import { ViewStatusContext } from "../mathzone";
import ViewIncorrectQuestion from "./ViewIncorrectQuestion";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { MATHZONEDATAKEY } from "../../../../constants";
import { useDispatch } from "react-redux";
import { openCloseIncorrectMathzoneQuestion } from "../../../../redux/features/ComponentLevelDataReducer";
interface DataInterface {
  total: number;
  incorrect: number;
  score: number;
  correct: number;
  skipped: number;
  name: string;
}
export default function StudentView({
  practiceId,
  userId,
}: {
  practiceId: string;
  userId: string;
}) {
  const [data, setData] = useState<DataInterface[]>([]);
  const [topScorer, setTopScorer] = useState(false);
  const [openAnimation, setOpenAnimation] = useState(false);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const viewResultData = otherData[MATHZONEDATAKEY.viewIncorrectQuestion] || {};
  useEffect(() => {
    getStudentResult(practiceId, userId);
  }, []);
  const getStudentResult = async (
    live_class_practice_id: string,
    user_id: string
  ) => {
    try {
      let result = await StudentResultMathZone({
        live_class_practice_id,
        user_id,
      });
      findAnimation(result?.data?.result_data || []);
      setData(result?.data?.result_data);
    } catch (e) {
      console.log("error in api", e);
    }
  };
  const findAnimation = (data: DataInterface[]) => {
    if (openAnimation || data.length < 1) return;
    let temp = data[0] || {};
    let percentageCalc = (temp?.correct || 0) / (temp?.total || 1);
    if (percentageCalc >= 0.8) {
      setTopScorer(true);
    } else {
      setTopScorer(false);
    }
    handleOpenAnimation();
  };
  const handleOpenAnimation = () => {
    let id = setTimeout(() => {
      setOpenAnimation(true);
      clearTimeout(id);
      handleCloseAnimation();
    }, 500);
  };
  const handleCloseAnimation = () => {
    let id = setTimeout(() => {
      clearTimeout(id);
      setOpenAnimation(false);
    }, 5000);
  };
  const {
    handleCloseReviewResultStatus,
    handleOpenReviewResultStatus,
    reviewResultStatus,
  } = useContext(ViewStatusContext);
  const dispatch = useDispatch();
  const handleClose = () => {
    handleCloseReviewResultStatus();
  };
  const handleOpenResponse = () => {
    handleOpenReviewResultStatus();
  };
  useEffect(() => {
    if (viewResultData?.isOpenViewIncorrectResult) handleOpenResponse();
    else {
      handleClose();
    }
  }, [viewResultData?.isOpenViewIncorrectResult]);
  useEffect(() => {
    return () => {
      dispatch(
        openCloseIncorrectMathzoneQuestion({
          openCurrentQuestion: false,
          practiceId: "",
          tutorId: "",
          currentUserId: "",
          mathzoneKeys: MATHZONEDATAKEY.viewIncorrectQuestion,
        })
      );
    };
  }, []);
  console.log(viewResultData?.isOpenViewIncorrectResult);
  return (
    <>
      {openAnimation && !topScorer && <ChildHappyAnimation />}
      {openAnimation && topScorer && <VictoryAnimation />}
      {reviewResultStatus ? (
        <>
          <ViewIncorrectQuestion
            practiceId={viewResultData?.practiceId || ""}
            id={viewResultData?.currentUserId || ""}
            user_id={viewResultData?.tutorId || ""}
            onClick={() => {}}
            currentIndex={viewResultData?.currentIndex || 0}
          />
        </>
      ) : (
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
            <div className="borderRight bgColor textColor">
              Skipped Questions
            </div>
            <div className="borderRight bgColor textColor">Correct </div>
            <div className="borderRight bgColor textColor">Incorrect </div>
            <div className="bgColor textColor">Score</div>

            {data?.map((item, i) => (
              <React.Fragment key={i}>
                <div className="borderRight borderTop">{item?.name}</div>
                <div className="borderRight borderTop">{item?.total || 0}</div>
                <div className="borderRight borderTop">
                  {item?.skipped || 0}
                </div>
                <div className="borderRight borderTop">{item?.correct}</div>
                <div className="borderRight borderTop pointer">
                  {item?.incorrect}
                </div>
                <div className="borderTop ">{item?.score}</div>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      )}
    </>
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
