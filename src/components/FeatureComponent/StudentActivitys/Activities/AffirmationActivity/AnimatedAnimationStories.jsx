import { FlippingPages } from "flipping-pages";
import "flipping-pages/dist/style.css";
import { useEffect, useRef, useState } from "react";
import styles from "./stories.module.css";
import "./styles.css";
// let  arr = [
//   "https://check-in-activity.s3.ap-south-1.amazonaws.com/affirmation/Page-1.jpg",
//   "https://check-in-activity.s3.ap-south-1.amazonaws.com/affirmation/Page-2.jpg",
//   "https://check-in-activity.s3.ap-south-1.amazonaws.com/affirmation/Page-3.jpg",
//   "https://check-in-activity.s3.ap-south-1.amazonaws.com/affirmation/Page-4.jpg",
//   "https://check-in-activity.s3.ap-south-1.amazonaws.com/affirmation/Page-5.jpg",
//  ];;
const AnimatedAnimationStories = ({
  identity,
  storyBookPageNumber,
  handleChangePageNumber,
  storyBook,
  isStudentActivityEnd,
}) => {
  let arr = storyBook;

  const [selected, setSelected] = useState(Number(storyBookPageNumber) || 0);
  const [animationDuration, setAnimationDuration] = useState(800);
  const throttleRef = useRef(null);
  const pageFlippingSound = () => {
    let audio = new Audio("/static/media/Audio/pageFlipSound.wav");
    // audio.play()
  };
  const sendPageNumberToParticipant = (val) => {
    handleChangePageNumber(val);
  };
  const handleThrottling = () => {
    throttleRef.current = setTimeout(() => {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }, 2000);
  };
  const back = () => {
    if (isStudentActivityEnd) return;
    if (throttleRef.current) return;
    setSelected(selected - 1);
    pageFlippingSound();
    sendPageNumberToParticipant(selected - 1);
    handleThrottling();
  };

  const next = () => {
    if (isStudentActivityEnd) return;
    if (throttleRef.current) return;
    setSelected(selected + 1);
    pageFlippingSound();
    sendPageNumberToParticipant(selected + 1);
    handleThrottling();
  };
  useEffect(() => {
    if (identity !== "tutor") {
      let animationDelay =
        Math.abs(storyBookPageNumber - selected) > 1 ? 0 : 800;
      setAnimationDuration(animationDelay);
      setSelected(storyBookPageNumber || 0);
      pageFlippingSound();
    }
  }, [storyBookPageNumber]);
  return (
    <div
      className={styles.parent}
      style={{ position: "relative", clear: "both" }}
    >
      {identity === "tutor" && (
        <div
          className={styles.arrowButtonContainer}
          style={{ width: "80%", background: "red", zIndex: 1 }}
        >
          {selected > 0 && !isStudentActivityEnd && (
            <button onClick={back} className={styles.leftArrow}>
              <img
                src="/static/media/lessthan1.png"
                style={{
                  width: 16,
                  height: 21,
                }}
              />
            </button>
          )}
          {selected < arr?.length - 1 && !isStudentActivityEnd && (
            <button onClick={next} className={styles.rightArrow}>
              <img
                src="/static/media/greaterthan1.png"
                style={{
                  width: 16,
                  height: 21,
                }}
              />
            </button>
          )}
        </div>
      )}
      <div className="pages">
        <FlippingPages
          direction="right-to-left"
          selected={selected}
          animationDuration={animationDuration}
          shadowBackground={"rgb(0, 0, 0, 0.25)"}
          disableSwipe={true}
        >
          {arr?.map((item, i) => (
            <div className="page" key={i}>
              <img src={item?.story} />
            </div>
          ))}
        </FlippingPages>
      </div>
    </div>
  );
};

export default AnimatedAnimationStories;
