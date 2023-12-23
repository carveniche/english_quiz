import React, { useContext, useState } from "react";
import PassagePage from "./PassagePage";
import PreviewModal from "./PreviewModal";
import { Button } from "@mui/material";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";

export default function ReadingComprehensive({ group_data, question_data }) {
  const {
    showQuestion,
    handleShowPreviewData,
    previewGroupData,
    currentQuestion,
    handleChangeQuestion,
  } = useContext(GroupQuestionContext);
  const handleQuestionChange = (val) => {
    if (currentQuestion + 1 < question_data.length) {
      handleChangeQuestion(val);
    }
  };
  console.log(group_data);
  return (
    <>
      {showQuestion ? (
        <>
          {previewGroupData && (
            <PreviewModal
              group_data={group_data}
              onClick={() => handleShowPreviewData(false)}
            />
          )}

          <div>
            {!previewGroupData && (
              <Button
                variant="contained"
                sx={{ float: "right" }}
                onClick={() => handleShowPreviewData(true)}
              >
                Preview
              </Button>
            )}
          </div>
          <div style={{ clear: "both", marginTop: 10 }}></div>
        </>
      ) : (
        <>
          <PassagePage groupData={group_data} />
        </>
      )}
    </>
  );
}
