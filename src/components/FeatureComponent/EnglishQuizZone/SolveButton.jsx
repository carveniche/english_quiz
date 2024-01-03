import styles from "../Mathzone/component/OnlineQuiz.module.css";

import styles2 from "../Mathzone/outerPage.module.css";

export default function SolveButton({ onClick, hasAnswerSubmitted }) {
  return true ? (
    <>
      {hasAnswerSubmitted ? (
        <div
          className={`${styles2.checkButton} ${styles.checkButtonWaiting}`}
          id="solveBtn"
        >
          {<b>please wait...</b>}
        </div>
      ) : (
        <button
          onClick={onClick}
          className={`${styles2.checkButton} ${styles.checkButtonColor}`}
          id="solveBtn"
        >
          Solve
        </button>
      )}
    </>
  ) : null;
}
