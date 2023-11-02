import "./styles.css";
import styles from "./stories.module.css";
import { FlippingPages } from "flipping-pages";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { cicoComponentLevelDataTrack } from "../../../../redux/features/ComponentLevelDataReducer";
import "flipping-pages/dist/style.css";
import { CICO } from "../../../../constants";
import LessonNextIcon from "../../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonNextIcon";
import LessonPreviousIcon from "../../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonPreviousIcon";
export interface stories {
  story: string;
}
export default function AnimatedAnimationStories({
  identity,
  stories,
  currentPage,
  isTeacherEndCheckInActivity,
  handleDataTrack,
}: {
  identity: string;
  stories: stories[];
  currentPage: number;
  isTeacherEndCheckInActivity: boolean;
  handleDataTrack: Function;
}) {
  const throttleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleThrottling = () => {
    throttleRef.current = setTimeout(() => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      throttleRef.current = null;
    }, 0);
  };
  const pageFlippingSound = () => {
    let audio = new Audio("/static/media/Audio/pageFlipSound.wav");
    // audio.play()
  };
  const dispatch = useDispatch();
  const back = () => {
    if (isTeacherEndCheckInActivity) return;
    if (throttleRef.current) return;
    let obj: any = {
      currentPage: currentPage - 1,
      isShowStories: true,
      isCheckInShowNextButton: false,
    };
    obj.senderIdentity = "tutor";
    dispatch(cicoComponentLevelDataTrack(obj));
    pageFlippingSound();
    handleThrottling();
    handleDataTrack({ data: obj, key: CICO.checkIn });
  };
  const next = () => {
    if (isTeacherEndCheckInActivity) return;
    if (throttleRef.current) return;
    let obj: any = {
      currentPage: currentPage + 1,
      isShowStories: true,
      isCheckInShowNextButton: false,
    };
    obj.senderIdentity = "tutor";
    dispatch(cicoComponentLevelDataTrack(obj));
    handleDataTrack({ data: obj, key: CICO.checkIn });
    pageFlippingSound();
    handleThrottling();
  };
  return (
    <div
      className={styles.parent}
      style={{ position: "relative", clear: "both" }}
    >
      {/* {identity === "tutor" && (
        <div
          className={styles.arrowButtonContainer}
          style={{
            width: "80%",
            background: "red",
            zIndex: 1,
          }}
        >
          {currentPage > 0 && !isTeacherEndCheckInActivity && (
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
          {currentPage < stories?.length - 1 &&
            !isTeacherEndCheckInActivity && (
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
      )} */}
      <div className="pages">
        <FlippingPages
          direction="right-to-left"
          selected={currentPage}
          animationDuration={800}
          shadowBackground={"rgb(0, 0, 0, 0.25)"}
          disableSwipe={true}
        >
          {stories?.map(({ story }, i) => (
            <div className="page" key={i}>
              <img src={story} />
            </div>
          ))}
        </FlippingPages>
        {identity === "tutor" && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="flex gap-2  justify-center items-center ml-[5px] bg-[#000]  rounded-full">
              {currentPage > 0 && !isTeacherEndCheckInActivity && (
                <button onClick={back} className={styles.leftArrow}>
                  <LessonPreviousIcon />
                </button>
              )}
              {currentPage < stories?.length - 1 &&
                !isTeacherEndCheckInActivity && (
                  <button onClick={next}>
                    <LessonNextIcon />
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
