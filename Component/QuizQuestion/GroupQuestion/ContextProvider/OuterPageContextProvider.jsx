import { createContext, useState } from "react";
import { flushSync } from "react-dom";
export const OuterPageContext = createContext("outer page context");
export default function OuterPageContextProvider({ children }) {
  const [showQuizResponse, setShowQuizResponse] = useState(false);
  const [hasQuizAnswerSubmitted, setHasQuizAnswerSubmitted] = useState(false);
  const value = {
    showQuizResponse,
    setShowQuizResponse,
    setHasQuizAnswerSubmitted,
    hasQuizAnswerSubmitted,
  };
  const handleShowQuizResponse = () => {
    flushSync(() => {
      setShowQuizResponse(true);
    });
  };
  window.reactShowQuizResponse = handleShowQuizResponse;
  return (
    <OuterPageContext.Provider value={value}>
      {children}
    </OuterPageContext.Provider>
  );
}
