import { Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "./Listening.module.css";

import ListeningPlayer from "./ListeningPlayer";
import CloseIcon from "@mui/icons-material/Close";
import QuestionCommonContent from "../../../CommonComponent/QuestionCommonContent";
export default function ListeningModal({ group_data, onClick, from, autoPlay }) {
  const handleClose = () => {
    typeof onClick === "function" && onClick();
  };

  const questionName = { questionName: group_data?.questionName?.page_1 }
  const panda ="https://d3g74fig38xwgn.cloudfront.net/english-zone/images/panda-for-listening.png"
  return (

    <div className={styles.listening_body}>
      <div className={styles.listening_content_section}>
        <QuestionCommonContent obj={questionName} />
        <img src={panda} alt="not found" />
      </div>
      {Array.isArray(group_data?.resources) && group_data.resources.length > 0 &&
        <ListeningPlayer audioUrl={group_data?.resources[0]?.url} autoPlay={autoPlay} />
      }


    </div>
  );
}
