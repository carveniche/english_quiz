import React from "react";
import TeacherView from "./TeacherView";
import StudentView from "./StudentView";
// import TeacherView from "./TeacherView";

export default function QuizCompleted({
  identity,
  userId,
  conceptName,
  conceptTag,
  liveClassPracticeId,
}) {
  return (
    <>
      {identity === "tutor" ? (
        <TeacherView userId={userId} practiceId={liveClassPracticeId} />
      ) : (
        <StudentView userId={userId} practiceId={liveClassPracticeId} />
      )}
    </>
  );
}
