import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";
export default function QuestionContent({ choicesRef }) {
  const [update, setUpdate] = useState(false);
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const handleChange = (e, index) => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    let value=e.target.value||""
    if(value.trim().length>choicesRef.current[index].value.length){
      
      initialFocus(index+1)
    }
    else{
      choicesRef.current[index].studentAnswer = value;
    }

    
    setUpdate(!update);
  };
  
  const focusRef=useRef([])
  const findLastElement=(index)=>{
  let arr=focusRef.current
  for(let i=index;i>-1;i--){
    if(arr[i])
    {
      arr[i].focus()
        return
    
    }
  }
  }
  const initialFocus=(startingValue)=>{
    let arr=focusRef.current
    for(let i=startingValue;i<arr.length;i++){
      if(arr[i])
      {
        arr[i].focus()
        return
      }
    }
  }
  useEffect(()=>{
    initialFocus(0)
  },[])
const handleKeyChange=(e,key)=>{
  let value=choicesRef.current[key].studentAnswer
  if(!value&&e.key=="Backspace"){
 findLastElement(key-1)

}
}
  return (
    <div>
      <div className={styles.questionContent} style={{marginTop:8,gap:2}}>
        {choicesRef.current.map((item, key) => (
          <React.Fragment key={key}>
            {key > 0 && <>&nbsp;</>}
            {item?.correct ? (
              <input
                size={item?.value?.length || 1}
                value={item?.studentAnswer || ""}
                ref={(el)=>focusRef.current[key]=el}
                onChange={(e) => handleChange(e, key)}
                onKeyDown={(e)=>handleKeyChange(e,key)}
                minLength={1}
                style={{    
                  fontSize: 16,
                  padding: 5,
                  margin:"0px 5px",
                boxSizing:"border-box",textAlign:"center"}}
              
              />
            ) : (
              item?.value
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
