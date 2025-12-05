import { createContext, useContext, useState, useEffect } from "react";

import { useMediaQuery } from "@mui/material";
// import jsonDataTesting from "../../../testingData";
const AppContext = createContext();
export function AppProvider({ children,data }) {
  const [showHeader, setShowHeader] = useState("");
  const [showLevel, setShowLevel] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showQuestionIndex, setShowQuestionIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const showDesktop = useMediaQuery("(min-width:1024px)");
  const [state, setState] = useState({});
  const [container,setContainer] = useState(null)
  const [title,setTitle] =useState('')
 
  useEffect(() => {
    window.changeShowLevel = setShowLevel;
    window.changeSubmit = setIsSubmit;
    window.changeLoading = setLoading;
    window.changeFlag = setFlag;
    setState(data || {});

    setShowLevel(null);
    setIsSubmit(false);
    const root = document.getElementById("root");
    setContainer(root)
    return () => {
      window.changeShowLevel = null;
      window.changeSubmit = null;
      window.changeLoading = null;
      window.changeFlag = null;
    }
  },[data])
  
  return (
    <AppContext.Provider
      value={{
        state, setState,
        showHeader, setShowHeader,
        showDesktop, flag, setFlag,
        showLevel, setShowLevel,
        isSubmit, setIsSubmit,
        showQuestionIndex, setShowQuestionIndex,
        loading, setLoading,
        title,setTitle,
        container
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}