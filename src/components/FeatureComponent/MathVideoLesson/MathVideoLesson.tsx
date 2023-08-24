import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function MathVideoLesson() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];

  useEffect(() => {
    console.log("extraParams in useEffect", extraParams);
  }, [extraParams]);

  return <div>Math Video Lesson</div>;
}
