import React from "react";
import styles from "../english_mathzone.module.css";
import Draggable from "react-draggable";
import { STUDENTANSWER } from "../../Utility/Constant";
export default function DragDropSolution({
  questionContent,
}) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        className={`${styles.match_the_following_DropContainer}`}
      >
        {questionContent?.map((item, key) =>
          !item?.isMissed ? (
            <div
              key={key}
              className={styles.match_the_following_Drop_Inner_Container}
            >
              <div>
                {item?.type === "image" ? (
                  <img src={item?.num_value} />
                ) : (
                  item?.num_value
                )}
              </div>
              <div>{item?.value}</div>
            </div>
          ) : (
            <div
              key={key}
              className={styles.match_the_following_Drop_Inner_Container}
            >
              <div>
                {item?.type === "image" ? (
                  <img src={item?.num_value} />
                ) : (
                  item?.num_value
                )}
              </div>

              {true ? (
                <Draggable
               disabled={true}
                >
                  <div
                    className={styles.match_the_following_drag_inner_container}
                    style={{
                      backgroundColor: `${"indigo" }`,
                    }}
                  
                  >
                    <div
                      
                    >
                      {item.value}
                    </div>
                  </div>
                </Draggable>
              ) : (
                <div
                  className={styles.match_the_following_drag_inner_container}
                  style={{
                    backgroundColor: `${item.show ? "indigo" : "initial"}`,
                  }}
                
                >
                  <div></div>
                </div>
              )}
            </div>
          )
        )}
      </div>
      
    </div>
  );
}
