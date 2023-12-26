import React from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
export default function Page({ passage }) {
  return (
    <div className={styles.a4Page}>
      {passage.map((item, key) => {
        return (
          <React.Fragment key={key}>{objectParser(item, key)}</React.Fragment>
        );
      })}
    </div>
  );
}
