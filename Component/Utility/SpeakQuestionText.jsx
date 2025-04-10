import React, { useEffect, useState } from "react";

import SpeakPlainText from "./SpeakPlainText";

export default function SpeakQuestionText({ readText }) {
  const [text, setText] = useState("");

   useEffect(() => {
    if (readText.length > 0) {
      const type = ['a', 'video', 'audio', 'img', 'br'];
  
      let combinedText = readText.reduce((acc, node) => {
        return !type.includes(node.node) ? acc + node.value : acc;
      }, "");
  
      if (combinedText.includes("__")) {
        while (combinedText.includes("__")) {
          combinedText = combinedText.replaceAll("__", "_");
        }
      }
  
      combinedText = combinedText.replaceAll("_", " blank ");
      combinedText = combinedText.replaceAll("br", "");
  
      const cleanedText = combinedText
        .split(".")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(". "); // 👈 Convert array back to string with proper spacing
      setText(cleanedText);
    }
  }, [readText]);
  
  

  return (
    <SpeakPlainText readText={text} />
  );
}

