import React, { useEffect, useRef, useState } from "react";
import styles from "../english_mathzone.module.css";
import Draggable from "react-draggable";
import { dragdropPointCordinate } from "../../Utility/CommonDragMethod/dragDropCoordinate";
import { validateCoordiante } from "../../Utility/CommonDragMethod/validateCoordinate";
export default function DragDrop({
  choiceRef,
  questionContent,
  choices,
  submitResponse,
  disabledQuestion,
}) {
  const [dropState, setDropState] = useState(questionContent || []);
  const [dragState, setDragState] = useState([]);
  const [dragKey, setDragKey] = useState(false);
  const [dropKey, setDropKey] = useState(1);
  const droppableContainerRef = useRef([]);
  useEffect(() => {
    let tempChoices = [];
    choices.forEach((element, index) => {
      tempChoices.push({
        id: index + 1,
        value: element,
        show: true,
      });
    });
    setDragState([...tempChoices]);
  }, []);
  const handleStop1 = (e, i) => {
    if (disabledQuestion || submitResponse) return;
    let [x, y] = dragdropPointCordinate(e);
    const [row, col] = validateCoordiante(droppableContainerRef.current, {
      x,
      y,
    });
    if (
      row > -1 &&
      col > -1 &&
      dropState[col].isMissed &&
      !dropState[col].show
    ) {
      dropState[col].dropVal = dragState[i]?.value || "";
      dragState[i].show = false;
      dropState[col].show = true;
      setDragState([...dragState]);
      setDropState([...dropState]);
    } else {
      setDragKey(Number(!dragKey));
    }
  };
  const handleStop2 = (e, i) => {
    if (disabledQuestion || submitResponse) return;
    let value = dropState[i].dropVal;
    dropState[i].dropVal = false;
    dropState[i].show = false;
    for (let item of dragState) {
      if (!item.show) {
        if (item.value == value) {
          item.show = true;
          break;
        }
      }
    }
    setDropState([...dropState]);
    setDragState([...dragState]);
  };
  choiceRef.current = dropState;
  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        className={`${styles.match_the_following_DropContainer}`}
        key={{ dropKey }}
      >
        {dropState?.map((item, key) =>
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

              {item?.show ? (
                <Draggable
                  onStop={(e) => handleStop2(e, key)}
                  disabled={disabledQuestion || submitResponse}
                >
                  <div
                    className={styles.match_the_following_drag_inner_container}
                    style={{
                      backgroundColor: `${item.show ? "indigo" : "initial"}`,
                    }}
                    ref={(el) =>
                      (droppableContainerRef.current[key] = {
                        el,
                        isMissed: item.isMissed === true,
                        show: item?.show,
                      })
                    }
                  >
                    <div
                      ref={(el) =>
                        (droppableContainerRef.current[key] = {
                          el,
                          isMissed: item.isMissed === true,
                          show: item?.show,
                        })
                      }
                    >
                      {item?.dropVal}
                    </div>
                  </div>
                </Draggable>
              ) : (
                <div
                  className={styles.match_the_following_drag_inner_container}
                  style={{
                    backgroundColor: `${item.show ? "indigo" : "initial"}`,
                  }}
                  ref={(el) =>
                    (droppableContainerRef.current[key] = {
                      el,
                      isMissed: item.isMissed === true,
                      show: item?.show,
                    })
                  }
                >
                  <div></div>
                </div>
              )}
            </div>
          )
        )}
      </div>
      <div className={styles.questionName} style={{ marginTop: "1rem" }}>
        Drag and Drop the answers.
      </div>
      <div
        className={styles.match_the_following_dragContainer}
        key={`${dragKey}`}
      >
        {dragState.map((item, key) =>
          item?.show ? (
            <Draggable
              key={key}
              onStop={(e) => handleStop1(e, key)}
              disabled={disabledQuestion || submitResponse}
            >
              <div
                className={styles.match_the_following_drag_inner_container}
                style={{
                  backgroundColor: `${item.show ? "indigo" : "initial"}`,
                }}
              >
                <div>{item?.value}</div>
              </div>
            </Draggable>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}
