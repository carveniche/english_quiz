import React, { useContext, useEffect, useRef, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import NotificationModal from "./NotificationModal";
export default function PassagePage({ groupData }) {
  const { handleShowQuestion } = useContext(GroupQuestionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const pageChangeRef=useRef(null)
  const handleChangePage = (val) => {
    if(pageChangeRef.current)
    return
    setCurrentPage(currentPage + val);
    let element =document.getElementsByClassName("english_vertical_bar")||[]
    for(let item of element){
      if(item)
      item.style.opacity="0.4"
    }
    pageChangeRef.current=setTimeout(()=>{
      for(let item of element){
        if(item)
        item.style.opacity="1"
      }
      clearTimeout(pageChangeRef.current)
      pageChangeRef.current=null
    },4000)
  };
  const leftArrowBtn = useRef(null);
  const rightArrowBtn = useRef(null);
  window.leftArrowBtn = leftArrowBtn.current;
  window.rightArrowBtn = rightArrowBtn.current
  const [hideNotification,setHideNotification]=useState(false)
  useEffect(()=>{
return ()=>clearTimeout(pageChangeRef.current)
  },[])
  return (
    <div
      style={{
        height: "100%",

        width: "fit-content",
        margin: "auto",
      }}
    >
      {!hideNotification&&<NotificationModal onClose={setHideNotification}/>}
     {hideNotification&& <>
        <Page passage={groupData[currentPage] || []} />
        {currentPage > 0 && (
          
          // <button
          //   onClick={() => handleChangePage(-1)}
          //   className={`${styles.reading_comprehensive_btn} ${styles.prev_btn} react_passage_change_page_change_btn react_passage_left_btn`}
          //   style={{ background: "initial", border: 0, cursor: "pointer" }}
          //   ref={leftArrowBtn}
          // >
          //   <LeftArrow />
          // </button>
          <button class={`${styles.leftButton} ${styles.naviagationButton} ${styles.prev_btn} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_left_btn`} onClick={() => handleChangePage(-1)}>
               <i class={`${styles.fa} ${styles["fa-caret-left"]}`}></i>
          </button>
        )}
        {currentPage + 1 < groupData.length ? (
            <button class={`${styles.next_btn} ${styles.naviagationButton} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_right_btn`} onClick={() => handleChangePage(1)}>
            <i class={`${styles.fa} ${styles["fa-caret-right"]}`}></i>
       </button>
          // <button
          //   onClick={() => handleChangePage(+1)}
          //   className={`${styles.reading_comprehensive_btn} ${styles.next_btn} react_passage_change_page_change_btn react_passage_right_btn`}
          //   ref={rightArrowBtn}
          // >
          //   <RightArrow />
          // </button>
        ) : (
          // <button
          //   className={`${styles.reading_comprehensive_btn} ${styles.next_btn} react_passage_change_page_change_btn react_passage_right_btn`}
          //   onClick={handleShowQuestion}
          //   ref={rightArrowBtn}
          // >
          //   <RightArrow />
          // </button>
          <button class={`${styles.next_btn} ${styles.naviagationButton} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn react_passage_right_btn`}  onClick={handleShowQuestion}>
          <i class={`${styles.fa} ${styles["fa-caret-right"]}`}></i>
     </button>
        )}
      </>}
    </div>
  );
}
