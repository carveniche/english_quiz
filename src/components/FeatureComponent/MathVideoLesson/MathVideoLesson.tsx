import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function MathVideoLesson() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];

  console.log("extraParams in math video lesson", extraParams);

  useEffect(() => {
    console.log("Math Video Lesson");
  }, []);

  return <div>Math Video Lesson</div>;
}
