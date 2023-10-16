import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ViewQuestionStatus from "./ViewQuestionStatus";

const expectedBackgroundColor = ["#FC7E41", "#4544C4"];
export default function TeachersTitle({
  remoteParticipant,
  isQuizCompleted,
  currentQuestion,
  totalQuestion,
  onClick,
  practiceId,
}) {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );
  const { extraParams } = activeTabArray[currentSelectedIndex];
  const totalQuestionArray = new Array(totalQuestion || 5).fill(1);
  const [selectedStudent, setSelectedStudent] = useState("");
  const selectedStudentRef = useRef(false);
  const handleSelectedStudent = (identity, from) => {
    if (from === "window") {
      setSelectedStudent("");
      return;
    }
    selectedStudentRef.current = true;
    if (identity) {
      if (identity === selectedStudent) setSelectedStudent("");
      else setSelectedStudent(identity);
    }
  };
  const handleWindowListener = () => {
    console.log("working");
    if (!selectedStudentRef.current) handleSelectedStudent("", "window");
    selectedStudentRef.current = false;
  };
  return (
    <div
      className={`flex bg-F5F5F5 ${
        isQuizCompleted ? "justify-between " : "justify-between "
      } px-4 py-2 items-center`}
    >
      <div style={{ visibility: totalQuestion ? "visible" : "hidden" }}>
        Q. {currentQuestion} / {totalQuestion}
      </div>

      <div>
        {extraParams?.conceptName} - {extraParams?.tagName} Level-
        {extraParams?.level}
      </div>
      {!isQuizCompleted ? (
        <div className="flex items-center justify-center gap-x-4">
          {remoteParticipant?.length ? (
            <div className="flex items-center justify-center gap-x-2">
              {remoteParticipant.map(({ identity }, i) => (
                <div key={i} className="relative">
                  <div
                    className="w-7 h-7 rounded-full flex justify-center items-center cursor-pointer"
                    style={{
                      background:
                        expectedBackgroundColor[
                          i % expectedBackgroundColor.length
                        ],
                      color: "#F2F2F2",
                    }}
                    onClick={() => handleSelectedStudent(identity)}
                  >
                    {(() => {
                      let names = identity?.split("-")[1];
                      if (names) {
                        names = names[0];
                        return names;
                      }

                      return names;
                    })()}
                  </div>
                  {identity === selectedStudent && (
                    <div className="bg-black p-3 absolute w-[196px] min-h-[78px] -right-2 rounded-sm top-10 z-10 flex flex-col justify-between">
                      <img
                        src="/menu-icon/polygon8.svg"
                        className=" w-4 h-3 absolute -top-2 right-4"
                        alt="top"
                      />
                      <div className="text-white">
                        {identity?.split("-")[1]}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <ViewQuestionStatus
                          totalQuestion={totalQuestion}
                          identity={identity}
                          practiceId={practiceId}
                          key={identity}
                          handleWindowListener={handleWindowListener}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
          <div
            onClick={onClick}
            className="cursor-pointer h-7 flex justify-center items-center py-1 px-3 border-black rounded-2xl bg-white border-black border-solid border-2"
          >
            Next
          </div>
        </div>
      ) : (
        <div style={{ minWidth: 10, visibility: "hidden" }}>dddddd</div>
      )}
    </div>
  );
}
