import React, { useEffect, useState } from "react";
import objectParser from "../../../Utility/objectParser";
import { useContext } from "react";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import ListeningPlayer from "./ListeningPlayer";
import ListeningModal from "./ListeningModal";
import { Button } from "@mui/material";
import styles from './Listening.module.css'
import QuestionCommonContent from "../../../CommonComponent/QuestionCommonContent";
export default function Listening({
  group_data,
  question_data,
  show_group_question,
}) {
  const {
    currentQuestion,
    handleChangeQuestion,
    handleShowPreviewData,
    previewGroupData,
    showQuestion,
    handleShowQuestion,
  } = useContext(GroupQuestionContext);
  // const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const handleQuestionChange = (val) => {
  //   if (currentQuestion + 1 < question_data.length) {
  //     handleChangeQuestion(val);
  //   }
  // };
  // useEffect(() => {
  //   setLoading(true);
  //   if (show_group_question) {
  //     handleShowQuestion();
  //   }
  //   setLoading(false);
  // }, [show_group_question]);
  // if (loading) return <h1>It is loading...</h1>;
  
   const questionName = { questionName: group_data?.questionName?.page_1 }
  const panda ="https://d3g74fig38xwgn.cloudfront.net/english-zone/images/panda-for-listening.png"
  const backgroundImage = "https://d3g74fig38xwgn.cloudfront.net/english-zone/images/bg-for-listening.png"


  return (
    <div className={styles.listening_container} style={{backgroundImage:`url(${backgroundImage})`}}>
      <div className={styles.layout_section}>
        {/* <ListeningModal
            group_data={group_data}
            onClick={handleShowQuestion}
            from={"non_preview"}
          />  */}

            <div className={styles.listening_body}>
      <div className={styles.listening_content_section}>
        <QuestionCommonContent obj={questionName} />
        <img src={panda} alt="not found" loading="lazy" />
      </div>

      {Array.isArray(group_data?.resources) && group_data.resources.length > 0 &&
        <ListeningPlayer audioUrl={group_data?.resources[0]?.url} autoPlay={false} />
      }


    </div>
      </div>
    
    </div>
  );
}
