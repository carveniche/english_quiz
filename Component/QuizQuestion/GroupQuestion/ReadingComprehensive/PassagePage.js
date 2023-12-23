import React, { useContext, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
export default function PassagePage({ groupData }) {
  const { handleShowQuestion } = useContext(GroupQuestionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const handleChangePage = (val) => {
    setCurrentPage(currentPage + val);
  };
  return (
    <div style={{ height: "100%" }}>
      <Page passage={groupData[currentPage] || []} />
      <div
        style={{
          display: "flex",
          width: "fit-content",
          margin: "10px auto",
          gap: 5,
        }}
      >
        {currentPage > 0 && (
          <button
            onClick={() => handleChangePage(-1)}
            className={styles["prev-button"]}
          >
            Prev
          </button>
        )}
        {currentPage + 1 < groupData.length ? (
          <button
            onClick={() => handleChangePage(+1)}
            className={styles["next-button"]}
          >
            Next
          </button>
        ) : (
          <button
            className={styles["next-button"]}
            onClick={handleShowQuestion}
          >
            Show Question
          </button>
        )}
      </div>
    </div>
  );
}
