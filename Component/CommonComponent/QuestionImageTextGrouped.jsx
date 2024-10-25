import React from "react";
import objectParser from "../Utility/objectParser";

export default function QuestionImageTextGrouped({ questionData }) {
  var textNodes = questionData.filter((node) => node.node !== "img");
  var imageNodes = questionData.filter((node) => node.node === "img");
  return (
    <div style={{ display: "flex", gap: "1%", maxWidth: "100%" }}>
      {textNodes && imageNodes ? (
        <>
          <div>
            {textNodes &&
              textNodes.length > 0 &&
              textNodes.map((item, key) => (
                <React.Fragment key={key}>
                  {objectParser(item, key)}
                </React.Fragment>
              ))}
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
        </>
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
    </div>
  );
}
