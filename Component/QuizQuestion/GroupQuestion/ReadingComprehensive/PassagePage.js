import React, { useContext, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import NotificationModal from "./NotificationModal";
import leftArrow from "../../../assets/Images/Svg/leftArrow.svg";
import rightArrow from "../../../assets/Images/Svg/rightArrow.svg";
import preview from "../../../assets/Images/Svg/preview.svg";
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
            <img src={leftArrow} style={{ width: 60 }} />
          </button>
        )}
        {currentPage + 1 < groupData.length ? (
          <button
            onClick={() => handleChangePage(+1)}
            className={`${styles.reading_comprehensive_btn} ${styles.next_btn}`}
          >
            <img src={rightArrow} style={{ width: 60 }} />
          </button>
        ) : (
          <button
            className={`${styles.reading_comprehensive_btn} ${styles.next_btn}`}
            onClick={handleShowQuestion}
          >
            <img src={rightArrow} style={{ width: 60 }} />
          </button>
        )}
      </>
    </div>
  );
}
