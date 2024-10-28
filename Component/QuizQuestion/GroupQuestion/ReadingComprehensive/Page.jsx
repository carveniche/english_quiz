import React, { useState } from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
export default function Page({ passage }) {
  const [linesLength, setLinesLength] = useState(passage.length || 0);
  return (
    // <div className={styles.a4Page}>
    <div
      style={{
        margin: linesLength <= 5 ? "auto" : "10px",
      }}
      className={`${styles.a4Page}  ${
        linesLength <= 5 ? styles.biggerFont : styles.smallerFont
      }`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {passage.map((item, key) => {
          return (
            <React.Fragment key={key}>{objectParser(item, key)}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
