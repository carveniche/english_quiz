import React, { useState } from "react";

import styles from "../english_mathzone.module.css";
import objectParser from "../../Utility/objectParser";
import Recording_part from "./Recording_part";
import ResourceViewer from "../../CommonComponent/ResourceViewer";
import QuestionImageTextGrouped from "../../CommonComponent/QuestionImageTextGrouped";

export default function Speaking_Type({ questionData, questionResponse }) {
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
  return (
    <div>
      <div>
        <ResourceViewer resources={questionData?.resources || []} />
      </div>

      <div
        className={styles.questionName}
        style={{ display: "flex", alignItems: "center" }}
      >
        <QuestionImageTextGrouped questionData={questionData?.questionName} />
      </div>

      <Recording_part
        questionData={questionData}
        questionResponse={questionResponse}
      />
    </div>
  );
}
