import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import shuffle from "shuffle-array";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
export default function DragDrop({
  questionData,
  choiceRef,
  direction,
  isSolution,
  response,
}) {
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const { showQuizResponse } = useContext(OuterPageContext);
  const onDragEnd = (result) => {
    if (submitResponse || disabledQuestion) return;
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      questionContent,
      result.source.index,
      result.destination.index
    );
    setQuetionContent([...items]);
  };
  const [questionContent, setQuetionContent] = useState([]);
  useEffect(() => {
    let temp = [...questionData];
    temp = shuffle(temp);
    setQuetionContent([...temp]);
  }, []);
  useEffect(() => {
    if (showQuizResponse || isSolution) {
      let temp = [...questionData];
      if (response && response?.length && Array.isArray(response))
        temp = [...response];
      setQuetionContent([...temp]);
    }
  }, [showQuizResponse]);
  choiceRef.current = questionContent;
  return (
    <div className={styles.questionContent}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable1" direction={direction}>
          {(provided, snapshot) => (
            <div
              className={
                direction === "horizontal"
                  ? styles.mathzoneHorizontalolBox
                  : styles.mathzoneMainOlBox
              }
              style={{ maxWidth: "50%" }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {questionContent.map((item, index) => (
                <Draggable
                  key={String(index)}
                  draggableId={String(index)}
                  index={index}
                  isDragDisabled={submitResponse || disabledQuestion}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        width: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50px",
                        padding: "10px 20px",
                        fontSize: "35px",
                      }}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
