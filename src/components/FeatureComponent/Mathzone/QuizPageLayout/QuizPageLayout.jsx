import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "../component/OnlineQuiz.module.css";
import {
  eclipse1,
  greenEclipse,
  polygon3,
  Rectangle66,
  Vector22,
  Star5,
  whiteStar,
} from "../IconExporter/IconExporter";
import handleResizeWidth from "../handleResizeWidth";
let QuizPageLayout;
export default QuizPageLayout = forwardRef((props, ref) => {
  const { children, height } = props;
  console.log(height);
  const commonResizeFun = () => {
    handleResizeWidth();
  };
  useEffect(() => {
    handleResizeWidth();

    window.addEventListener("resize", commonResizeFun);
    return () => {
      window.removeEventListener("resize", commonResizeFun);
    };
  }, []);
  function onShowRoughBoard() {
    props.openRoughBoardScreen(!showRoughBoard);
    props.updatestateforchild(!showRoughBoard);
    setShowRoughBoard(!showRoughBoard);
  }
  const quizCanvasScreenElement = useRef(null);
  const [showRoughBoard, setShowRoughBoard] = useState(false);
  useImperativeHandle(ref, () => ({
    onRemoteShowRoughBoard(status) {
      var showBoardStat = status == "true";

      setShowRoughBoard(showBoardStat);

      var storedLine = JSON.parse(
        localStorage.getItem("quizcanvasretainedlines")
      );
      if (storedLine != "") {
        console.log("hello");
        props.onSendWhiteBoardLines(storedLine);
        ref.current.onRemoteLineUpdate(storedLine);
      }
    },
    onRemoteLineUpdate(quizCanvasLine) {
      var storedLine = JSON.parse(
        localStorage.getItem("quizcanvasretainedlines")
      );
      if (storedLine != "") {
        console.log("Its not empty");
        if (quizCanvasScreenElement.current != null) {
          quizCanvasScreenElement.current.onRemoteLineUpdate(quizCanvasLine);
        }
      } else {
        console.log("It is actually empty");
        if (quizCanvasScreenElement.current != null) {
          quizCanvasScreenElement.current.onRemoteLineUpdate(quizCanvasLine);
        }
      }
    },

    onRemoteClearCanvas(clearPage) {
      try {
        quizCanvasScreenElement.current.onRemoteClearCanvas(0);
      } catch (error) {
        console.log("Error", error);
      }
    },
  }));

  return (
    <>
      <>
        <div
          className={styles.bodyPage}
          id="quizbodypage"
          style={{
            height: `calc(100% - ${height}px)`,
            maxHeight: `calc(100% - ${height}px)`,
            minHeight: `calc(100% - ${height}px)`,
          }}
        >
          <div style={{ position: "relative" }}></div>
          <div style={{ position: "relative", left: 0 }}></div>
          <img src={eclipse1} alt="not foundd" className={styles.eclipse1} />
          <img
            src={greenEclipse}
            alt="greeneclipse"
            className={styles.eclipseGreen}
          />
          <img src={polygon3} alt="polygon3" className={styles.polygon3} />
          <img src={Star5} alt="Star5" className={styles.star5} />
          <img src={Vector22} alt="vector22" className={styles.Vector22} />
          <img
            src={Rectangle66}
            alt="Rectangle66"
            className={styles.rectangle}
          />
          <img src={whiteStar} alt="whiteStar" className={styles.whiteStar} />

          {children}
        </div>
      </>
    </>
  );
});
