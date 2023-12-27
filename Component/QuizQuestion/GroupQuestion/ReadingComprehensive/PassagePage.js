import React, { useContext, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import NotificationModal from "./NotificationModal";
import LeftArrow from "../../../assets/Images/Svg/LeftArrow";
import RightArrow from "../../../assets/Images/Svg/RightArrow";
export default function PassagePage({ groupData }) {
  const { handleShowQuestion } = useContext(GroupQuestionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const handleChangePage = (val) => {
    setCurrentPage(currentPage + val);
  };
  console.log(groupData);
  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        width: "fit-content",
        margin: "auto",
      }}
    >
      <Page passage={groupData[currentPage] || []} />
      <NotificationModal />
      <>
        {currentPage > 0 && (
          <button
            onClick={() => handleChangePage(-1)}
            className={`${styles.reading_comprehensive_btn} ${styles.prev_btn}`}
            style={{ background: "initial", border: 0, cursor: "pointer" }}
          >
          <LeftArrow />
          </button>
        )}
        {currentPage + 1 < groupData.length ? (
          <button
            onClick={() => handleChangePage(+1)}
            className={`${styles.reading_comprehensive_btn} ${styles.next_btn}`}
          >
          <RightArrow />
          </button>
        ) : (
          <button
            className={`${styles.reading_comprehensive_btn} ${styles.next_btn}`}
            onClick={handleShowQuestion}
          >
           <RightArrow />
          </button>
        )}
      </>
    </div>
  );
}
