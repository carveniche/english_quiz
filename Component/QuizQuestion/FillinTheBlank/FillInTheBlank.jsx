import React, { useContext, useMemo, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { ValidationContext } from "../../QuizPage";

export default function FillInTheBlank({ obj }) {
   const [redAlert, setRedAlert] = useState(false);
   const {
      submitResponse,
      disabledQuestion,
      setIsCorrect,
      setSubmitResponse,
      setStudentAnswer,
      showSolution,
      readOut,
   } = useContext(ValidationContext);

   const parsedData = useMemo(() => {
      try {
         return JSON.parse(obj.question_data);
      } catch {
         return null;
      }
   }, [obj]);

   const [studentAnswers, setStudentAnswers] = useState({});

   if (!parsedData) return null;

   const parts = parsedData.questionName.parts || [];

   /* update answer */

   const handleChange = (blankId, value, index) => {
      setStudentAnswers((prev) => {
         const updated = {
            ...prev,
         };

         /* single */

         if (index === undefined) {
            updated[blankId] = value.toUpperCase();
         } else {
            /* separate */
            updated[blankId] = updated[blankId] || [];

            updated[blankId][index] = value.toUpperCase();
         }

         return updated;
      });
   };

   /* validate */

   const validateAnswer = () => {
      const blanks = parts.filter((part) => part.type === "blank");
      let allAnswered = true;
      let allCorrect = true;

      for (const blank of blanks) {
         const studentValue = studentAnswers[blank.id];
         /* single */

         if (blank.inputType === "single") {
            if (!studentValue || !studentValue.trim()) {
               allAnswered = false;
               continue;
            }

            if (studentValue.trim().toUpperCase() !== blank.answer.trim().toUpperCase()) {
               allCorrect = false;
            }
         } else if (blank.inputType === "missing") {
            /* missing/separate */
            const correct = blank.slots.filter((item) => item.missed == true);
            const correctValues = correct.map((item) => item.letter).join("");
            const joined = (studentValue || []).join("").toUpperCase();
            if (joined.length !== correct.length) {
               allAnswered = false;
               continue;
            }
            if (joined !== correctValues) {
               allCorrect = false;
            }
         } else {
            /* missing/separate */
            const correct = blank?.answer.toUpperCase();
            const joined = (studentValue || []).join("").toUpperCase();
            if (joined.length !== correct.length) {
               allAnswered = false;
               continue;
            }
            if (joined !== correct) {
               allCorrect = false;
            }
         }
      }

      if (!allAnswered) return -1;

      return allCorrect ? 1 : 0;
   };

   const handleInputChange = (e, blankId, si) => {
      const value = e.target.value.toUpperCase();

      handleChange(blankId, value, si);

      /* auto next */

      if (value && e.target.nextElementSibling?.tagName === "INPUT") {
         e.target.nextElementSibling.focus();
         e.target.nextElementSibling.select();
      }
   };

   const handleInputKeyDown = (e) => {
      /* left */

      if (e.key === "ArrowLeft") {
         const prev = e.target.previousElementSibling;

         if (prev?.tagName === "INPUT") {
            e.preventDefault();
            prev.focus();
            prev.select();
         }
      }

      /* right */

      if (e.key === "ArrowRight") {
         const next = e.target.nextElementSibling;

         if (next?.tagName === "INPUT") {
            e.preventDefault();
            next.focus();
            next.select();
         }
      }

      /* backspace */

      if (e.key === "Backspace" && !e.target.value) {
         const prev = e.target.previousElementSibling;

         if (prev?.tagName === "INPUT") {
            e.preventDefault();
            prev.focus();
            prev.select();
         }
      }
   };

   const handleSubmit = () => {
      if (submitResponse) return;
      if (disabledQuestion) return;

      const answerStatus = validateAnswer();
      if (answerStatus == -1) {
         setRedAlert(true);
         return -1;
      }
      setSubmitResponse(true);
      // setStudentAnswer(JSON.stringify(arr));
      setIsCorrect(answerStatus);

      return answerStatus;
   };
   return (
      <>
         <SolveButton onClick={handleSubmit} />
         {redAlert && !submitResponse && (
            <CustomAlertBoxMathZone msg={"Please Type the Answer"} />
         )}

         <div
            style={{
               flexWrap: "wrap",
               gap: 8,
               lineHeight: "53px",
               whiteSpace: "pre-wrap",
            }}
         >
            {parts.map((part, index) => {
               /* text */

               if (part.type === "text") {
                  return <span key={index}>{part.value}</span>;
               }
               if (part.type === "newline") {
                  return <br key={index} />;
               }         

               /* single */
               if (part.inputType === "single") {
                  return (
                     <input
                        readOnly={disabledQuestion || submitResponse}
                        key={index}
                        type="text"
                        value={studentAnswers[part.id] || ""}
                        onChange={(e) => handleChange(part.id, e.target.value)}
                        style={{
                           width: 180,
                           height: 40,
                           border: "1px solid #ccc",
                           borderRadius: 8,
                           padding: "0 12px",
                        }}
                     />
                  );
               }

               /* separate/missing */
               return (
                  <div
                     key={index}
                     style={{
                        display: "inline-flex",
                        gap: 6,
                     }}
                  >
                     {part.slots.map((slot, si) => {
                        /* missing static */
                        if (part.inputType === "missing" && !slot.missed) {
                           return (
                              <div
                                 key={si}
                                 style={{
                                    width: 40,
                                    height: 40,
                                    background: "#3d3d5c",
                                    color: "#fff",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                 }}
                              >
                                 {slot.letter}
                              </div>
                           );
                        }

                        return (
                           <input
                              readOnly={disabledQuestion || submitResponse}
                              key={si}
                              type="text"
                              maxLength={1}
                              value={studentAnswers[part.id]?.[si] || ""}
                              onChange={(e) => handleInputChange(e, part.id, si)}
                              onKeyDown={handleInputKeyDown}
                              style={{
                                 width: 40,
                                 height: 40,
                                 textAlign: "center",
                                 border: "1px solid #ccc",
                                 borderRadius: 8,
                              }}
                           />
                        );
                     })}
                  </div>
               );
            })}
         </div>
      </>
   );
}
