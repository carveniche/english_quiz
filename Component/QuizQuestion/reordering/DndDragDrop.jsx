
import React, { useContext, useEffect, useMemo, useState } from "react";
import shuffle from "shuffle-array";
import styles from "../english_zone.module.css";

import { ValidationContext } from "../../QuizPage";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, children, disabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

const modifiedTransform = transform
  ? {
      ...transform,
      x: transform.x * 0.9,
      y: transform.y * 0.9,
      scaleX: 1,   // ✅ stop font scale
      scaleY: 1,   // ✅ stop font scale
    }
  : null;


  const style = {
    transform: CSS.Transform.toString(modifiedTransform),
    transition,
    cursor: disabled ? "not-allowed" : "grab",
    userSelect: "none",
    opacity: isDragging ? 0.6 : 1,
    touchAction: "none", // ✅ important: prevents scroll while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function DndKitDragDrop({
  questionData,
  choiceRef,
  direction = "vertical",
  isSolution,
  response,
}) {
  const { submitResponse, disabledQuestion,showSolution } = useContext(ValidationContext);
  const { showQuizResponse } = useContext(OuterPageContext);

  // We need stable IDs even if item is string/ReactNode
  const [items, setItems] = useState([]);

  const disabled = submitResponse || disabledQuestion || showSolution;
  // Sensors (smooth drag)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // ✅ prevents accidental drag
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // init shuffle
  useEffect(() => {
    let temp = [...questionData];
    temp = shuffle(temp);

    // wrap items with id
    const withId = temp.map((it, idx) => ({
      id: `item-${idx}-${Date.now()}`, // stable unique id per mount
      content: it,
    }));

    setItems(withId);
  }, []);

  // solution/response mode
  useEffect(() => {
    if (showQuizResponse || isSolution) {
      let temp = [...questionData];
      if (response && response?.length && Array.isArray(response)) temp = [...response];

      const withId = temp.map((it, idx) => ({
        id: `item-${idx}-${Date.now()}`,
        content: it,
      }));

      setItems(withId);
    }
  }, [showQuizResponse]);

  // keep current order in ref
  useEffect(() => {
    choiceRef.current = items.map((x) => x.content);
  }, [items]);

  const strategy =
    direction === "horizontal"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === active.id);
      const newIndex = prev.findIndex((x) => x.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className={styles.questionContent}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={disabled ? undefined : onDragEnd}
      >
        <SortableContext items={items.map((x) => x.id)} strategy={strategy}>
          <div
            className={
              direction === "horizontal"
                ? styles.mathzoneHorizontalolBox
                : styles.mathzoneMainOlBox
            }
            style={{
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {items.map((it) => (
              <SortableItem key={it.id} id={it.id} disabled={disabled}>
                {it.content}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
















// // export default function DndDragDrop() {
// //   return (
// //     <div>DndDragDrop</div>
// //   )
// // }

// import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import shuffle from "shuffle-array";

// import styles from "../english_zone.module.css";
// import { ValidationContext } from "../../QuizPage";
// import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";

// const ITEM_TYPE = "SORT_ITEM";

// // reorder helper
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

// function SortableItem({
//   item,
//   index,
//   moveItem,
//   isDragDisabled,
//   direction,
// }) {
//   const ref = useRef(null);

//   // DROP (hover logic)
//   const [, drop] = useDrop({
//     accept: ITEM_TYPE,
//     hover: (dragged) => {
//       if (!ref.current) return;
//       if (dragged.index === index) return;

//       // move on hover
//       moveItem(dragged.index, index);

//       // update dragged index for smooth ordering
//       dragged.index = index;
//     },
//   });

//   // DRAG
//   const [{ isDragging }, drag] = useDrag({
//     type: ITEM_TYPE,
//     item: { index },
//     canDrag: !isDragDisabled,
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: isDragDisabled ? "not-allowed" : "grab",
//         userSelect: "none",
//       }}
//     >
//       {item}
//     </div>
//   );
// }

// export default function DndDragDrop({
//   questionData,
//   choiceRef,
//   direction = "vertical",
//   isSolution,
//   response,
// }) {
//   const { submitResponse, disabledQuestion } = useContext(ValidationContext);
//   const { showQuizResponse } = useContext(OuterPageContext);

//   const [questionContent, setQuetionContent] = useState([]);

//   // init shuffle
//   useEffect(() => {
//     let temp = [...questionData];
//     temp = shuffle(temp);
//     setQuetionContent([...temp]);
//   }, []);

//   // show solution / response order
//   useEffect(() => {
//     if (showQuizResponse || isSolution) {
//       let temp = [...questionData];
//       if (response && response?.length && Array.isArray(response)) temp = [...response];
//       setQuetionContent([...temp]);
//     }
//   }, [showQuizResponse]);

//   // keep in ref
//   useEffect(() => {
//     choiceRef.current = questionContent;
//   }, [questionContent]);

//   const isDragDisabled = submitResponse || disabledQuestion;

//   const moveItem = (fromIndex, toIndex) => {
//     if (isDragDisabled) return;

//     setQuetionContent((prev) => {
//       return reorder(prev, fromIndex, toIndex);
//     });
//   };

//   return (
//     <div className={styles.questionContent}>
//       <DndProvider backend={HTML5Backend}>
//         <div
//           className={
//             direction === "horizontal"
//               ? styles.mathzoneHorizontalolBox
//               : styles.mathzoneMainOlBox
//           }
//           style={{
//             width: "100%",
//             maxWidth: "100%",
//             // ✅ prevents left/right page scroll without touching body
//             overflowX: "hidden",
//           }}
//         >
//           {questionContent.map((item, index) => (
//             <SortableItem
//               key={index}
//               item={item}
//               index={index}
//               moveItem={moveItem}
//               isDragDisabled={isDragDisabled}
//               direction={direction}
//             />
//           ))}
//         </div>
//       </DndProvider>
//     </div>
//   );
// }
