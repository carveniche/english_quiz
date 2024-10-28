import React, { useContext, useEffect, useRef, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import NotificationModal from "./NotificationModal";
export default function PassagePage({ groupData }) {
  const { handleShowQuestion } = useContext(GroupQuestionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const pageChangeRef = useRef(null);
  const handleChangePage = (val) => {
    if (pageChangeRef.current) return;
    setCurrentPage(currentPage + val);
    let element = document.getElementsByClassName("english_vertical_bar") || [];
    for (let item of element) {
      if (item) item.style.opacity = "0.4";
    }
    pageChangeRef.current = setTimeout(() => {
      for (let item of element) {
        if (item) item.style.opacity = "1";
      }
      clearTimeout(pageChangeRef.current);
      pageChangeRef.current = null;
    }, 4000);
  };
  const leftArrowBtn = useRef(null);
  const rightArrowBtn = useRef(null);
  window.leftArrowBtn = leftArrowBtn.current;
  window.rightArrowBtn = rightArrowBtn.current;
  const [hideNotification, setHideNotification] = useState(false);
  useEffect(() => {
    return () => clearTimeout(pageChangeRef.current);
  }, []);
  return (
    <div
      style={{
        height: "100%",

        width: "fit-content",
        margin: "auto",
        paddingBottom: "10px",
        height: "fit-content",
      }}
    >
      {!hideNotification && <NotificationModal onClose={setHideNotification} />}
      {hideNotification && (
        <>
          <Page passage={groupData[currentPage] || []} />
          {currentPage > 0 && (
            <button
              className={`${styles.leftButton} ${styles.naviagationButton} ${styles.prev_btn} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_left_btn`}
              onClick={() => handleChangePage(-1)}
            >
              <i className={`${styles.fa} ${styles["fa-caret-left"]}`}></i>
            </button>
          )}
          {currentPage + 1 < groupData.length ? (
            <button
              className={`${styles.next_btn} ${styles.naviagationButton} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_right_btn`}
              onClick={() => handleChangePage(1)}
            >
              <i className={`${styles.fa} ${styles["fa-caret-right"]}`}></i>
            </button>
          ) : (
            <button
              className={`${styles.next_btn} ${styles.naviagationButton} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_right_btn`}
              onClick={() => {
                !pageChangeRef.current && handleShowQuestion();
              }}
            >
              <i className={`${styles.fa} ${styles["fa-caret-right"]}`}></i>
            </button>
          )}
        </>
      )}
    </div>
  );
}
