import React, { useState } from "react";

import styles from "../english_mathzone.module.css";
import objectParser from "../../Utility/objectParser";
import Recording_part from "./Recording_part";
// import ResourceViewer from "../../CommonComponent/ResourceViewer";
// import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";

export default function Speaking_Type({
  questionData,
  questionResponse,
  wordsLength,
}) {
  // const objectParser = (item, index) => {
  //   let value = "";
  //   if (item?.node === "text") {
  //     value = <>{item?.value}</>;
  //   } else if (item?.node === "img") {
  //     value = <img src={item?.value} />;
  //   } else if (item?.node === "audio") {
  //     value = <>Audio symbol</>;
  //   }
  //   if (item?.inNewLine) return <div>{value}</div>;
  //   return value;
  // };
  var textNodes = questionData?.questionName.filter(
    (node) => node.node !== "img"
  );
  var imageNodes = questionData?.questionName.filter(
    (node) => node.node === "img"
  );
  const isEnglishStudentLevel =
    localStorage.getItem("isEnglishStudentLevel") || false;
  console.log("isEnglishStudentLevel", isEnglishStudentLevel);

  const [isTrue,setIsTrue]=useState(false)
  const direction=isTrue? 'column':'row'
  console.log(direction,isTrue)

  return (
    <div className="red" style={{display:'flex',flexDirection:`${direction}`,justifyContent:'space-around'}}>
      {/* <div>
        <ResourceViewer resources={questionData?.resources || []} />
      </div> */}
      

      <div
        className={styles.questionName}
        style={{ display: "flex", alignItems: "center",justifyContent:'center' }}
      >
        {textNodes && imageNodes ? (
          <div style={{ display: "flex", gap: "40px",flexDirection:'column' }}>
            <div
              className={`${wordsLength <= 30 ? styles.biggerFont : ""}`}
              style={{
                display: "flex",
                alignItems: wordsLength <= 30 ? "center" : "",
              }}
            >
              {/* {isEnglishStudentLevel && (
                  <SpeakQuestionText readText={textNodes} /> 

              )} */}
              <div>
                {textNodes &&
                  textNodes.length > 0 &&
                  textNodes.map((item, key) => (
                    <React.Fragment key={key}>
                      {objectParser(item, key)}
                    </React.Fragment>
                  ))}
                {/* {questionData?.resources.length > 0 && (
                  <AudiPlayerComponent
                    resources={questionData?.resources || []}
                  />
                )} */}
              </div>
            </div>
            <div>
              {imageNodes &&
                imageNodes.length > 0 &&
                imageNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
            </div>
                                          
{questionData?.resources.length > 0 && (
                    <AudiPlayerComponent resources={questionData?.resources || []} />
                  )}
          </div>
        ) : (
          <>
            {questionData?.questionName?.length ? (
              <>
                {questionData?.questionName.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
              </>
            ) : null}
          </>
        )}
        {/* {questionData?.questionName?.length ? (
          <>
            <div>
              {questionData?.questionName.map((item, key) => (
                <React.Fragment key={key}>
                  {objectParser(item, key)}
                </React.Fragment>
              ))}
            </div>
          </>
        ) : null} */}
      </div>    

      <Recording_part
        questionData={questionData}
        questionResponse={questionResponse}
        setIsTrue={setIsTrue}
      />      
    </div>
  );
}
