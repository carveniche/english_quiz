import React, { useContext } from "react";
import styled from "styled-components";
import MyAnswer from "../../component/AnswerFolder/myAnswer";
export default function TeacherViewEachResponseEnd({
  response,
  type,
  timerStatus,
  questionDatas,
}) {
  return (
    <Modal style={{ position: "relative" }}>
      <MyAnswer
        obj={response}
        type={type}
        timerStatus={timerStatus}
        studentResponseData={questionDatas}
      />
    </Modal>
  );
}
// onClick={handleModalOff}

const Modal = styled.div`
  // width:80%;
  // margin:auto;
  // top:10%;
  // min-height:90% !important;
  // max-height:90% !important;
  position: relative;

  // @media only screen and (max-width:1180px){
  //     top:14%;
  //         min-height:86% !important;
  //     max-height:86% !important;

  //     }
  // @media only screen and (max-width:1001px){
  // top:18%;
  //     min-height:82% !important;
  // max-height:82% !important;

  // width:78%;

  // }
`;
