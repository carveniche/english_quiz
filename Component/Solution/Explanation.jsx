import React, { useContext, useEffect } from "react";
import styles from "./Solution.module.css";
import { ValidationContext } from "../QuizPage";
import SpeakPlainText from "../Utility/SpeakPlainText";
export default function Explanation({ obj }) {
  let question_data = JSON.parse(obj?.question_data);
  let model = question_data?.solutionModel || [];
  const { readOut } = useContext(ValidationContext);
 const textNode= model?.filter(item => item?.text?.trim()).map(item => item.text.trim()).join(" ");

  return model?.length ? (
    <>
      <>
          <div style={{display:"flex",alignItems:"center"}}>
          {obj?.read_out && <SpeakPlainText readText={textNode}/> }
            {model?.map((item, index) => {
              return (
                <div key={index} style={{display:'flex'}} className="para_text">
                  {item?.text && item?.text.replace(/^ {3,}/gm, "")}
                  {item?.images && <img src={item?.images} />}
                </div>
              );
            })}
          </div>
      </>
    </>
  ) : (
    ""
  );
}
