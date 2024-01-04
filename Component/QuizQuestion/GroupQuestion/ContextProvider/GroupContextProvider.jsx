import { createContext, useState } from "react";

export const GroupQuestionContext = createContext("Reading");

export default function GroupQuestionContextProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [previewGroupData, setPreviewGroupData] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const handleChangeQuestion = (val) => {
    setCurrentQuestion(val);
    if (typeof window.onChangeGroupQuestion === "function") {
      window.onChangeGroupQuestion(val + currentQuestion);
    }
  };
  const handleChangePage = (value) => {
    setCurrentPage(value);
  };
  const handleShowQuestion = () => {
    typeof window.showQuestionCb === "function" && window.showQuestionCb(true);
    setShowQuestion(true);
  };
  window.setShowGroupQuestion = setShowQuestion;
  const handleShowPreviewData = (val) => {
    setPreviewGroupData(val);
  };
  const value = {
    handleChangePage,
    showQuestion,
    currentPage,
    previewGroupData,
    handleShowPreviewData,
    handleShowQuestion,
    currentQuestion,
    handleChangeQuestion,
  };
  const checkGroupStatus = (cb) => {
    typeof cb === "function" && cb();
    return showQuestion;
  };
  window.checkGroupStatus = checkGroupStatus;
  return (
    <GroupQuestionContext.Provider value={value}>
      {children}
    </GroupQuestionContext.Provider>
  );
}
