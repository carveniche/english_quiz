import React, { useContext, useMemo, useState } from "react";
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { ValidationContext } from "../../QuizPage";
import style from "./fill_in_the_blank.module.css";

export default function FillInTheBlank({ obj }) {
   const [redAlert, setRedAlert] = useState(false);
   const [mode, setMode] = useState("box")
   const {
      submitResponse,
      disabledQuestion,
      setIsCorrect,
      setSubmitResponse,
      setStudentAnswer,
      showSolution,
      readOut,
   } = useContext(ValidationContext);

   const [studentAnswers, setStudentAnswers] = useState({});
   const [statusMap, setStatusMap] = useState({});

   const parsedData = useMemo(() => {
      try {
         const tempObj = JSON.parse(obj.question_data);
         setMode(tempObj?.input_mode)
         return tempObj;
      } catch {
         return null;
      }
   }, [obj]);

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
            updated[blankId] = value?.toLowerCase();
         } else {
            /* separate */
            updated[blankId] = updated[blankId] || [];

            updated[blankId][index] = value?.toLowerCase();
         }

         return updated;
      });
   };



   const handleInputChange = (e, blankId, si) => {
      const value = e.target.value?.toLowerCase();
      if (value && value.length > 1) return;
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
   const tempStatusMap = {}
   /* validate */
   const validateAnswer = () => {
      const blanks = parts.filter((part) => part.type === "blank");
      let allAnswered = true;
      let allCorrect = true;

      // ✅ take full parts array — inject studentAnswer only into blanks
      const updatedResponse = parts.map((part) => {

         // text and newline — pass through untouched
         if (part.type === "text" || part.type === "newline") {
            return { ...part };
         }

         const studentValue = studentAnswers[part.id];
         // ── single ────────────────────────────────────────────────────────────
         if (part.inputType === "single") {
            if (!studentValue || !studentValue.trim()) allAnswered = false;
            else if (studentValue.trim()?.toLowerCase() !== part.answer.trim()?.toLowerCase()) allCorrect = false;
            return {
               ...part,
               studentAnswer: studentValue || "",  // ✅ flat string
            };
         }

         // ── missing ───────────────────────────────────────────────────────────
         if (part.inputType === "missing") {
            const correct = part.slots.filter((s) => s.missed).map((s) => s.letter?.toLowerCase()).join("");
            const joined = (studentValue || []).join("")?.toLowerCase();
            if (joined.length !== correct.length) allAnswered = false;
            else if (joined !== correct) allCorrect = false;

            return {
               ...part,
               slots: part.slots.map((slot, si) => ({
                  ...slot,
                  studentAnswer: slot.missed ? (studentValue?.[si] || "") : slot.letter, // ✅ per slot
               })),
            };
         }

         // ── separate ──────────────────────────────────────────────────────────
         const correct = part.answer?.toLowerCase();
         const joined = (studentValue || []).join("")?.toLowerCase();
         if (joined.length !== correct.length) allAnswered = false;
         else if (joined !== correct) allCorrect = false;

         return {
            ...part,
            slots: part.slots.map((slot, si) => ({
               ...slot,
               studentAnswer: studentValue?.[si] || "",  // ✅ per slot
            })),
         };
      });
      if (!allAnswered) return { status: -1, response: null };

      return { status: allCorrect ? 1 : 0, response: updatedResponse };
   };

   const handleSubmit = () => {
      if (submitResponse) return;
      if (disabledQuestion) return;

      const { status, response } = validateAnswer();
      if (status == -1) {
         setRedAlert(true);
         return -1;
      }
      setSubmitResponse(true);
      setStudentAnswer(JSON.stringify(response));
      setIsCorrect(status);

      return status;
   };
   const isReadOnly = disabledQuestion || submitResponse || showSolution;
   const inputClase = mode === "line" ? style.inputFieldLine : style.inputField
   return (
      <>
         <SolveButton onClick={handleSubmit} />
         {redAlert && !submitResponse && (
            <CustomAlertBoxMathZone msg={"Please Type the Answer"} />
         )}

         <div
            className={style.question_content_wrapper}
            style={{ lineHeight: mode == "line" ? "22px" : "47px" }}
         >
            {parts.map((part, index) => {
               /* text */


               if (part.type === "text") {
                  return <span key={index} className="para_text">{part.value}</span>;
               }
               if (part.type === "newline") {
                  return <br key={index} />;
               }

               /* single */
               if (part.inputType === "single") {
                  const singleVal = showSolution ? part?.studentAnswer : studentAnswers[part.id] || ""
                  const SINGLECLASSENAME = isReadOnly ? singleVal?.toLowerCase() == part?.answer ? style.Correct : style.Incorrect : ""
                  return (
                     <input
                        className={`para_text ${inputClase} ${SINGLECLASSENAME}`}
                        onPaste={(e) => e.preventDefault()}
                        readOnly={isReadOnly}
                        key={index}
                        type="text"
                        value={singleVal}
                        onChange={(e) => handleChange(part.id, e.target.value)}
                        style={{
                           width: 16 * (part.answer.length || 1)
                           // textAlign:"left"

                        }}
                        placeholder=" "
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-gramm="false"
                        data-enable-grammarly="false"
                     />
                  );
               }

               /* separate/missing */
               return (
                  <div
                     key={index}
                     className={style.inputFieldWrapper}

                  >
                     {part.slots.map((slot, si) => {
                        /* missing static */
                        const val = showSolution ? part?.slots[si]?.studentAnswer : studentAnswers[part.id]?.[si] || ""
                        const CLASSNAMEINP = isReadOnly ? val?.toLowerCase() == slot.letter?.toLowerCase() ? style.Correct : style.Incorrect : ""
                        if (part.inputType === "missing" && !slot.missed) {
                           return (
                              <div
                                 className={`para_text ${mode == "line" ? style.missingLetter : style.missingLetterBox}`}
                                 key={si}
                              >
                                 {slot.letter}
                              </div>
                           );
                        }
                        return (
                           <input
                              className={`${CLASSNAMEINP} para_text ${inputClase} `}
                              onPaste={(e) => e.preventDefault()}
                              readOnly={isReadOnly}
                              key={si}
                              type="text"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleInputChange(e, part.id, si)}
                              onKeyDown={handleInputKeyDown}
                              style={{
                                 width: mode ==="line" ? 30 : 40,

                              }}
                              placeholder=" "
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              data-gramm="false"
                              data-enable-grammarly="false"
                              data-form-type="other"     // ✅ blocks LastPass / browser form fill
                              inputMode="text"
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

export const InputAttributes = {

}
