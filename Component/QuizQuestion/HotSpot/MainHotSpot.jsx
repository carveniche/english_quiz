import React, { useContext, useEffect, useRef, useState } from 'react'
import CustomAlertBoxMathZone from '../../CommonComponent/CustomAlertBoxMathZone';
import SolveButton from '../../CommonComponent/SolveButton';
import { ValidationContext } from '../../QuizPage';
import SpeakPlainText from '../../Utility/SpeakPlainText';
import { ArrowBackIosNewRounded, ArrowForwardIosRounded } from '@mui/icons-material';
import { Zoom } from '@mui/material';
import './hotSpot.css';
import AudiPlayerComponent from '../../CommonComponent/AudiPlayerComponent';
import styles from "../../QuizQuestion/english_zone.module.css";
import QuestionCommonContent from '../../CommonComponent/QuestionCommonContent';
export default function MainHotSpot({ obj, wordsLength, questionData }) {

  const canvasRef = useRef(null);
  const [redAlert, setRedAlert] = useState(false);
  const [choices, setChoices] = useState([]); // Store in state
  const [showStudentResponse, setShowStudentResponse] = useState(false)
  const [questionText, setQuestionText] = useState({})
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    showSolution,
    setStudentAnswer,
    readOut,
    isGroup
  } = useContext(ValidationContext);

  const studentSelected = useRef(false); // Track selection

  useEffect(() => {
    if (obj?.question_data) {
      let question_text = JSON.parse(obj?.question_data);
      setQuestionText(question_text)
      setChoices(question_text?.choices)
    }
  }, [obj])

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    function drawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (questionText?.choice_type === "rectangle") {
        choices?.forEach((rect) => {
          const isShowAll = submitResponse && !showStudentResponse ? rect.studentAnswer : showStudentResponse

          const is_correct = rect?.isCorrect;
          // Outer Rectangle (Padding Effect)
          ctx.fillStyle = isShowAll ? is_correct ? "#14f17545" : "#e43c3ca1" : submitResponse ? '#8080803b' : "#0000ff30"; // Light gray background
          ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
          ctx.strokeStyle = isShowAll ? (is_correct ? "green" : "red") : submitResponse ? 'grey' : "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          if (rect.studentAnswer && !submitResponse) {
             ctx.fillStyle = "#ffd9516c"
             ctx.strokeStyle = "#ffcc00"
             ctx.lineWidth = 2;
             ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
             ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            // let circleRadius = 14;
            // let circleX = rect.x + rect.width / 2;
            // let circleY = rect.y + rect.height / 2;
            // ctx.beginPath();
            // ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            // ctx.fillStyle = "#ffcc00";
            // ctx.fill();
          }


          // Selected State (Smaller Filled Rectangle)
          if (isShowAll && questionText?.choice_type !== "rectangle") {
            // Small White Circle (10px × 10px)
            let circleRadius = 10;
            let circleX = rect.x + rect.width / 2;
            let circleY = rect.y + rect.height / 2;
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();

            const symbol = is_correct ? "✔" : "✖";
            ctx.font = "bold 12px Arial"; // Font size
            ctx.fillStyle = is_correct ? "green" : "red"; // Green for correct, red for incorrect
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(symbol, circleX, circleY);
          }



        });
        return;
      }

      // Handling Circle Choices
      choices?.forEach((circle) => {
        const is_correct = circle?.isCorrect;
        const isShowAll = submitResponse && !showStudentResponse ? circle.studentAnswer : showStudentResponse

        // Outer Circle
        const pd = 2
        ctx.beginPath();
        ctx.arc(circle.x, circle.y + pd, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isShowAll ? is_correct ? "#14f17545" : "#e43c3ca1" : submitResponse ? '#8080803b' : "#0000ff30";
        ctx.strokeStyle = isShowAll ? (is_correct ? "green" : "red") : submitResponse ? 'grey' : "blue";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Selected State (Inner Circle)
        if (circle.studentAnswer && !submitResponse) {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y + pd, circle.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = "#ffcc00";
          ctx.fill();

        }
        if (isShowAll) {
          // Small White Circle
          let circleRadius = 8;
          let circleX = circle.x; // Center remains same
          let circleY = circle.y + pd; // Center remains same
          ctx.beginPath();
          ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();

          // Draw ✔ (correct) or ✖ (incorrect)
          const symbol = is_correct ? "✔" : "✖";
          ctx.font = "bold 8px Arial";
          ctx.fillStyle = is_correct ? "green" : "red";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(symbol, circleX, circleY);
        }

      });

    }

    if (showSolution && obj?.questionResponse) {
      let question_response = JSON.parse(obj?.questionResponse);
      setChoices(question_response)
      setSubmitResponse(showSolution)
      drawAll()
      return
    }


    drawAll();
    function handleCanvasClick(e) {
      if (showSolution || submitResponse) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // Scale factor in X direction
      const scaleY = canvas.height / rect.height; // Scale factor in Y direction

      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      let select = false;
      let elements = [...choices];

      elements.forEach((element) => {
        const dx = clickX - element.x;
        const dy = clickY - element.y;

        if (questionText?.choice_type == "rectangle") {
          if (
            clickX >= element.x &&
            clickX <= element.x + element.width &&
            clickY >= element.y &&
            clickY <= element.y + element.height
          ) {
            element.studentAnswer = !element.studentAnswer;
            select = true;
          }
        } else {
          if (dx * dx + dy * dy < element.radius * element.radius) {
            select = true;
            element.studentAnswer = !element.studentAnswer;
          }
        }
      });

      if (select) {
        setChoices(elements);
        drawAll();
        studentSelected.current = true;
      }
    }

    function handleCanvasHover(e) {
      if (showSolution || submitResponse) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // Scale factor in X direction
      const scaleY = canvas.height / rect.height; // Scale factor in Y direction

      const hoverX = (e.clientX - rect.left) * scaleX;
      const hoverY = (e.clientY - rect.top) * scaleY;

      let hovering = false;
      choices.forEach((element) => {
        const dx = hoverX - element.x;
        const dy = hoverY - element.y;

        if (dx * dx + dy * dy < element.radius * element.radius) {
          hovering = true;
        }
        if (
          hoverX >= element.x &&
          hoverX <= element.x + element.width &&
          hoverY >= element.y &&
          hoverY <= element.y + element.height
        ) {
          hovering = true;
        }
      });

      canvas.style.cursor = hovering ? "pointer" : "default";
    }


    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("mousemove", handleCanvasHover); // Listen for mouse movement

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("mousemove", handleCanvasHover);
    };

  }, [questionText, showStudentResponse,submitResponse]); // Depend on questionText

  function handleSubmit() {

    if (submitResponse) return -2;
    if (disabledQuestion) return -2;
    let correctValue = -1;
    if (studentSelected.current) {

      const isAllCorrect = choices?.every(item => (item.studentAnswer ?? false) === item.isCorrect);
      if (isAllCorrect) {
        correctValue = 1;
      } else {
        correctValue = 0;
      }
      setStudentAnswer(JSON.stringify(choices));
      setSubmitResponse(true);
      setIsCorrect(correctValue);

      return correctValue;
    }

    setRedAlert(true)
    return correctValue;
  }


  return (
    <>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div className={`hotspot_container ${isGroup ? "_group" : ""} `} >
        <div className="hotspot_questionText">

          {typeof questionText?.questionName === "object" ?
            <QuestionCommonContent obj={questionText} />
            :
            <div className='audio_with_questiontext'>
              <SpeakPlainText readText={questionText?.questionName} />
              <div className='common_questionText'>
                {questionText?.questionName}
              </div>

            </div>
          }

          {questionText?.resources?.length > 0 && (
            <AudiPlayerComponent resources={questionText?.resources} />
          )}
        </div>

        <div className='flex-col relative'>
          {showSolution || submitResponse ?

            <div className='heading_slider_btn'>
              <p className='label_title show_heading'>{showStudentResponse ? "These answers are accurate" : "Student Response"}</p>
              {showStudentResponse ?
                <ArrowBackIosNewRounded className='pointer' onClick={() => setShowStudentResponse(false)} />
                : <ArrowForwardIosRounded className='pointer' onClick={() => setShowStudentResponse(true)} />
              }
            </div> : ''}


          <Zoom
            key={showStudentResponse}  // Forces re-render on state change
            in={true}
            timeout={400}  // Adjust duration for smooth zoom
            mountOnEnter
            unmountOnExit
          >
            <div className="hotspot_image" style={{ backgroundImage: `url(${questionText?.image})` }}>
              <canvas className="canvas" ref={canvasRef} width="610" height="400"></canvas>
            </div>
          </Zoom>


        </div>
      </div>
    </>
  );
}
