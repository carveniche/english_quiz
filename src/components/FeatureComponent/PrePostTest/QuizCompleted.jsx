import React from "react";
import TeacherView from "./Results/TeacherView";
// import TeacherView from "./TeacherView";

export default function QuizCompleted({
  identity,
  userId,
  conceptName,
  conceptTag,
  liveClassPracticeId,
  reportsData,
  student,
}) {
  return (
    <>
      {identity === "tutor" ? (
        <TeacherView
          userId={userId}
          practiceId={liveClassPracticeId}
          reportsData={reportsData}
          student={student}
          identity={"identity"}
        />
      ) : (
        <>
          <TeacherView
            userId={userId}
            practiceId={liveClassPracticeId}
            reportsData={reportsData}
            student={student}
            identity={identity}
          />
        </>
      )}
    </>
  );
}
