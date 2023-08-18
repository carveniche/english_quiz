import React from "react";
import styles from "./Solution.module.css";
import parse from "html-react-parser";
import { optionSelectStaticMathField } from "../component/HorizontalFillUpsEquationType/replaceDomeNode/ReplaceDomNode";
import CkEditorAnswer from "../component/Ckeditor/CkEditorAnswer";
import OrcAnswered from "../component/ORC/OrcAnswered";
import OprcAnswered from "../component/Oprc/OprcAnswered";
import MainOl from "../component/OL/MainOl";
export default function ExplanationBoxContainer({ questionData, temp }) {
  return (
    <>
      {questionData.operation ? (
        <NewTypeSolution solution={temp?.solution || {}} />
      ) : (
        <OldTypeSolution
          model={questionData?.choice_data}
          type={questionData.question_type}
          obj={questionData}
        />
      )}
    </>
  );
}

function NewTypeSolution({ solution }) {
  let model = solution["model"] || solution[".model"] || [];
  return model?.length ? (
    <>
      <p className={styles.explanation}>Explanation: </p>
      <div
        className={`${styles.explanationBoxContainer} ${styles.word_wrap} ${styles.word_wrap_space}`}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            opacity: 0.8,
            color: "#666",
          }}
        >
          {model?.map((item, index) => {
            return (
              <div key={index}>
                {parse(item?.val ?? "", optionSelectStaticMathField)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  ) : (
    ""
  );
}

function OldTypeSolution({ model, type, obj }) {
  let oldType = {
    ckeditor: (
      <CkEditorAnswer
        str={obj?.question_text}
        choiceData={obj?.choice_data}
        hideSolutionText={true}
      />
    ),
    orc: <OrcAnswered obj={obj} question_text={obj?.question_text} />,
    ol: <MainOl obj2={{ question_data: [{ ...obj }] }} answer={true} />,
    oprc: <OprcAnswered obj={obj} />,
  };
  if (oldType.hasOwnProperty(type))
    return (
      <>
        <p className={styles.explanation}>Explanation: </p>
        <div className={styles.explanationBoxContainer}>
          <div
            style={{
              fontWeight: "initial",
              fontSize: "initial",
              lineHeight: "initial",
            }}
          >
            {oldType[type]}
          </div>
        </div>
      </>
    );
  return (
    <>
      {model?.length ? (
        <>
          <p className={styles.explanation}>Explanation: </p>
          <div className={styles.explanationBoxContainer}>
            <div
              style={{
                fontWeight: "initial",
                fontSize: "initial",
                lineHeight: "initial",
              }}
            >
              {model?.map(
                (item, i) =>
                  (item.correct ||
                    String(type).trim() == "Fill in the blanks ".trim()) && (
                    <div key={i}>
                      <div>{parse(item.choices)}</div>
                      {item?.solution && <div>{parse(item?.solution)}</div>}
                      {item?.solution_image && (
                        <div>{<img src={item?.solution_image} />}</div>
                      )}
                      {item?.solution1 && <div>{parse(item?.solution1)}</div>}
                      {item?.solution1_image && (
                        <div>{<img src={item?.solution1_image} />}</div>
                      )}
                      {item?.solution2 && <div>{parse(item?.solution2)}</div>}
                      {item?.solution2_image && (
                        <div>{<img src={item?.solution2_image} />}</div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
