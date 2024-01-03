import React, { useContext, useEffect, useState } from "react";
import PassagePage from "./PassagePage";
import PreviewModal from "./PreviewModal";
import { Button } from "@mui/material";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";

export default function ReadingComprehensive({
  group_data,
  question_data,
  show_group_question,
}) {
  const {
    showQuestion,
    handleShowPreviewData,
    previewGroupData,
    currentQuestion,
    handleChangeQuestion,
    handleShowQuestion,
  } = useContext(GroupQuestionContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (show_group_question) {
      handleShowQuestion();
    }
    setLoading(false);
  }, [show_group_question]);
  if (loading) return <h1>It is loading...</h1>;
  return (
    <>
      {showQuestion ? (
        <>
          {previewGroupData && (
            <PreviewModal
              group_data={group_data}
              onClick={() => {
                handleShowPreviewData(false);
              }}
            />
          )}

          <div>
            {!previewGroupData && (
              <Button
                variant="contained"
                sx={{ float: "right", display: "none" }}
                onClick={() => handleShowPreviewData(true)}
                id="react_preview_btn"
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
