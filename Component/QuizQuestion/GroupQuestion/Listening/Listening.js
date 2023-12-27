import React from "react";
import styles from "../../english_mathzone.module.css";
import objectParser from "../../../Utility/objectParser";
import { useContext } from "react";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import ListeningPlayer from "./ListeningPlayer";
import ListeningModal from "./ListeningModal";
import { Button } from "@mui/material";
export default function Listening({ group_data, question_data }) {
  const {
    currentQuestion,
    handleChangeQuestion,
    handleShowPreviewData,
    previewGroupData,
    showQuestion,
    handleShowQuestion,
  } = useContext(GroupQuestionContext);
  // const [currentQuestion, setCurrentQuestion] = useState(0);
  const handleQuestionChange = (val) => {
    if (currentQuestion + 1 < question_data.length) {
      handleChangeQuestion(val);
    }
  };

  return (
    <div className={styles.group}>
      {showQuestion ? (
        <>
          {previewGroupData && (
            <div>
              <ListeningModal
                group_data={group_data}
                from={"preview"}
                onClick={() => handleShowPreviewData(false)}
              />
            </div>
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
        </>
      ) : (
        <div>
          <ListeningModal
            group_data={group_data}
            onClick={handleShowQuestion}
            from={"non_preview"}
          />
        </div>
      )}
    </div>
  );
}
