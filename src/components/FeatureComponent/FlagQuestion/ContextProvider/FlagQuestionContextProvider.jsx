import React, { useState } from "react";
export const FlagQuestionContext = React.createContext("Status Context");
function FlagQuestionContextProvider({ children }) {
  const [reviewResultStatus, setReviewResultStatus] = useState(false);

  const handleCloseReviewResultStatus = () => {
    setReviewResultStatus(false);
  };
  const handleOpenReviewResultStatus = () => {
    setReviewResultStatus(true);
  };
  const [questionStatus, setQuestionStatus] = useState(false);
  const [currentIndex, setCurrentIndex] = useState({ index: -1, identity: "" });
  const [totalReviewResult, setTotalReviewResult] = useState(0);
  const [currentQuestionReview, setCurrentQuestionReview] = useState(0);
  const [questionDemount, setQuestionDemount] = useState(true);

  const updateTotalQuestionReview = (val) => {
    setTotalReviewResult(val);
  };
  const handleChangeQuestionReview = (val) => {
    setQuestionDemount(false);
    setCurrentQuestionReview(currentQuestionReview + val);
    let id = setTimeout(() => {
      clearTimeout(id);
      setQuestionDemount(true);
    }, 1);
  };
  const handleChangeHomeQuestionReview = (val) => {
    setQuestionDemount(false);
    setCurrentQuestionReview(val);
    let id = setTimeout(() => {
      clearTimeout(id);
      setQuestionDemount(true);
    }, 1);
  };
  const handleResponseCheck = (i, identity) => {
    setQuestionStatus(true);
    setCurrentIndex({ index: i, identity: identity });
  };
  const handleModalOff = () => {
    setQuestionStatus(false);
    setCurrentIndex(-1);
  };
  const [viewStatus, setViewStatus] = useState(false);
  const handleViewStatus = () => {
    setViewStatus(!viewStatus);
  };
  const [totalQuestion, setTotalQuestion] = useState(0);
  const handlePaginationRevieResult = (val) => {
    setQuestionDemount(false);
    setCurrentQuestionReview(val);
    let id = setTimeout(() => {
      clearTimeout(id);
      setQuestionDemount(true);
    }, 1);
  };
  const value = {
    viewStatus,
    setViewStatus,
    questionStatus,
    setQuestionStatus,
    handleResponseCheck,
    handleViewStatus,
    handleModalOff,
    currentIndex,
    totalQuestion,
    setTotalQuestion,
    handleChangeQuestionReview,
    updateTotalQuestionReview,
    totalReviewResult,
    currentQuestionReview,
    questionDemount,
    handlePaginationRevieResult,
    handleCloseReviewResultStatus,
    handleOpenReviewResultStatus,
    reviewResultStatus,
    handleChangeHomeQuestionReview,
    setQuestionDemount,
  };
  return (
    <FlagQuestionContext.Provider value={value}>
      {children}
    </FlagQuestionContext.Provider>
  );
}

export default FlagQuestionContextProvider;
