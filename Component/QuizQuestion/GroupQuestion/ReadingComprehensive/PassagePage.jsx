import React, { useContext, useEffect, useRef, useState } from "react";
import Page from "./Page";
import styles from "../../english_mathzone.module.css";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";

export default function PassagePage({ groupData }) {

 
  const { handleShowQuestion,showQuestion } = useContext(GroupQuestionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [questionName]=useState(groupData?.questionName)
  const pageChangeRef = useRef(null);
  const handleChangePage = (val) => {

    if (pageChangeRef.current) {
      clearTimeout(pageChangeRef.current);
    }
    
    // Update page number
    setCurrentPage((prevPage) => prevPage + val);
    
    const element = document.getElementsByClassName("english_vertical_bar") || [];
    
    // Set opacity to 0.4 for all elements with the class
    Array.from(element).forEach(item => {
      if (item) item.style.opacity = "0.4";
    });

    // Reset opacity after a timeout and clear timeout reference
    pageChangeRef.current = setTimeout(() => {
      Array.from(element).forEach(item => {
        if (item) item.style.opacity = "1";
      });
      pageChangeRef.current = null;
    }, 4000);
  };

  const [hideNotification, setHideNotification] = useState(false);


  const handleNavigationClick = (direction) => {
    console.log(direction,'direction')
    if (direction === "-1") {
      handleChangePage(-1);
    } else if (direction === "1") {
      handleChangePage(1);
    } else {
     handleShowQuestion();
    }
  };

  useEffect(()=>{
    const clearTime=setTimeout(()=>{
      setHideNotification(true)
    },3500)
    return ()=>clearTimeout(clearTime)
  },[])
  
  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => clearTimeout(pageChangeRef.current);
  }, []);

  return (
    <>
      {!hideNotification && (
        <Alert severity="warning" onClose={() => setHideNotification(true)}>
          Hey! You will get a passage now! Read it carefully and answer questions that follow.
        </Alert>
      )}

      <Page passage={questionName[`page_${+currentPage+1}`] || []} />

       <>
        {currentPage > 0 && <RenderButton direction="-1" onClick={handleNavigationClick} />}
        {currentPage + 1 < Object.keys(questionName).length ? (
          <RenderButton direction="1" onClick={handleNavigationClick} />
        ) : (
          <RenderButton direction="0" onClick={handleNavigationClick} />
        )}
      </>
    </>
  );
}

const RenderButton = ({ direction, onClick }) => {
  return (
    <div
      className={`${styles.naviagationButton} ${styles.reading_comprehensive_btn} react_passage_change_page_change_btn ${direction === "-1" ? styles.prev_btn : styles.next_btn}`}
      onClick={() => onClick(direction)}
    >
      <IconButton sx={{ color: "black" }}>
        {direction === "-1" ? <ArrowBackIos fontSize="large" /> : <ArrowForwardIos fontSize="large" />}
      </IconButton>
    </div>
  );
};
