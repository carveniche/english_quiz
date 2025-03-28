import React, { useContext, useEffect, useRef, useState } from 'react'
import CustomAlertBoxMathZone from '../../CommonComponent/CustomAlertBoxMathZone';
import SolveButton from '../../CommonComponent/SolveButton';
import { ValidationContext } from '../../QuizPage';

export default function MainHotSpot({ obj, wordsLength }) {



  let question_text = JSON.parse(obj?.question_data);

  return (
    <div><HotSpotPreview data={obj} question_text={question_text} /></div>
  )
}

function HotSpotPreview({ data, question_text }) {
  const canvasRef = useRef(null);
  const [redAlert, setRedAlert] = useState(false);
  const [choices, setChoices] = useState(question_text?.choices || []); // Store in state
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    showSolution,
    setStudentAnswer,
    readOut
  } = useContext(ValidationContext);

  const studentSelected = useRef(false); // Track selection

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    function drawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (question_text?.choice_type === "rectangle") {
        choices?.forEach((rect) => {

          const is_correct = rect?.isCorrect;
          // Outer Rectangle (Padding Effect)
          ctx.fillStyle = submitResponse ? is_correct ? "#14f17545" : "#e43c3ca1" : "#0000ff30"; // Light gray background
          ctx.fillRect(rect.x - 4, rect.y - 4, rect.width + 8, rect.height + 8);
          ctx.strokeStyle = submitResponse ? (is_correct ? "green" : "red") : "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(rect.x - 4, rect.y - 4, rect.width + 8, rect.height + 8);


          if (rect.studentAnswer && !submitResponse) {
            let circleRadius = 14;
            let circleX = rect.x + rect.width / 2;
            let circleY = rect.y + rect.height / 2;
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffcc00";
            ctx.fill();


            // ctx.fillStyle = ""; // Dark blue before submission, green/red after
            // let padding = rect.width * 0.2; // 20% padding inside
            // ctx.fillRect(rect.x + padding, rect.y + padding, rect.width - 2 * padding, rect.height - 2 * padding);
          
        }


          // Selected State (Smaller Filled Rectangle)
          if (submitResponse) {
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

        // Outer Circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = submitResponse ? (is_correct ? "#14f17545" : "#e43c3ca1") : "#0000ff30";
        ctx.strokeStyle = submitResponse ? (is_correct ? "green" : "red") : "blue";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Selected State (Inner Circle)
        if (circle.studentAnswer && !submitResponse) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = "#ffcc00";
            ctx.fill();
          
        }
        if (submitResponse) {
          // Small White Circle
          let circleRadius = 8;
          let circleX = circle.x; // Center remains same
          let circleY = circle.y; // Center remains same
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



    if (showSolution && data?.questionResponse) {
      let question_response = JSON.parse(data?.questionResponse?.studentAnswer);
      setChoices(question_response)
      setSubmitResponse(showSolution)
      drawAll()
      return
    }
    drawAll();
    if (submitResponse) return
    function handleCanvasClick(e) {
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

        if (question_text?.choice_type == "rectangle") {
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
  }, [question_text]); // Depend on question_text

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
      <div className="hotspot_container">
        <div className="hotspot_question_text">
          <p>{question_text?.questionName}</p>
        </div>
        <div className="hotspot_image" style={{ backgroundImage: `url(${question_text?.image})` }}>
          <canvas className="canvas" ref={canvasRef} width="504" height="504"></canvas>
        </div>
      </div>
    </>
  );
}
