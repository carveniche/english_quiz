import React, { useEffect, useState } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { ViewStatusContext } from "../Mathzone";
import styles from "../component/OnlineQuiz.module.css";
import { StudentResultMathZone } from "../../../../api";
import ViewIncorrectQuestion from "./ViewIncorrectQuestion";
export default function StudentView({
  practiceId,

  userId,
}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    getStudentResult(practiceId, userId);
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

  return (
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
            <div className="borderRight borderTop pointer">
              {item?.incorrect}
            </div>
            <div className="borderTop ">{item?.score}</div>
          </>
        ))}
      </Grid>
    </div>
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
