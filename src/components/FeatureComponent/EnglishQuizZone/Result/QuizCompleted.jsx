import React from "react";
import TeacherView from "./TeacherView";
// import TeacherView from "./TeacherView";

export default function QuizCompleted({
  identity,
  userId,
  live_class_id,
  english_live_practice_id,
}) {
  return (
    <>
      <TeacherView
        user_id={userId}
        live_class_id={live_class_id}
        english_live_practice_id={english_live_practice_id}
      />
    </>
  );
}
