import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { LESSON, ROUTERKEYCONST, WHITEBOARD } from "../../../constants";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  isStudentName,
  isTutorTechBoth,
} from "../../../utils/participantIdentity";
import {
  changePdfIndex,
  saveAllWhiteBoardData,
} from "../../../redux/features/ComponentLevelDataReducer";
import WhiteBoard from "../../WhiteBoardHelper/WhiteBoard";
import LessonDeleteIcon from "../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonDeleteIcon";
import LessonNextIcon from "../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonNextIcon";
import LessonPreviousIcon from "../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonPreviousIcon";
export default function Lesson() {
  const childRef = useRef(null);
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];

  const dispatch = useDispatch();
  const { allWhiteBoardRelatedData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let whiteBoardData =
    allWhiteBoardRelatedData[LESSON.lessonWhiteBoardData] || {};
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { extraParams } = activeTabArray[currentSelectedIndex];
  const { imageUrl, tagId } = extraParams || [];
  const handleDataTrack = (coordinates) => {
    if (coordinates?.type === "pageChange") {
      if (coordinates?.value - 1 === whiteBoardData.currentIndex) {
        return;
      }

      let DataTrackObj = {
        pathName: ROUTERKEYCONST.lesson,
        key: ROUTERKEYCONST.lesson,
        value: {
          datatrackName: WHITEBOARD.pdfIndex,
          index: coordinates?.value - 1 || 0,
          dataTrackKey: LESSON.lessonWhiteBoardData,
        },
      };
      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));

      dispatch(
        changePdfIndex({
          index: coordinates?.value - 1 || 0,
          dataTrackKey: LESSON.lessonWhiteBoardData,
        })
      );

      setIsImageLoaded(false);
      return;
    }
    coordinates.index = whiteBoardData.currentIndex;
    coordinates.identity = userId;
    coordinates.userName = isTutorTechBoth({ identity: `${role_name}` })
      ? role_name
      : isStudentName({ identity: `${role_name}` });

    let DataTrackObj = {
      pathName: ROUTERKEYCONST.lesson,
      key: ROUTERKEYCONST.lesson,
      value: {
        identity: userId,
        name: role_name,
        datatrackName: WHITEBOARD.whiteBoardData,
        whiteBoardData: coordinates,
        dataTrackKey: LESSON.lessonWhiteBoardData,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handlePdfChange = (val: number) => {
    if (
      whiteBoardData.currentIndex + val < imageUrl.length &&
      whiteBoardData.currentIndex + val >= 0
    ) {
      let DataTrackObj = {
        pathName: ROUTERKEYCONST.lesson,
        key: ROUTERKEYCONST.lesson,
        value: {
          datatrackName: WHITEBOARD.pdfIndex,
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: LESSON.lessonWhiteBoardData,
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      dispatch(
        changePdfIndex({
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: LESSON.lessonWhiteBoardData,
        })
      );
      setIsImageLoaded(false);
    }
  };
  const handleUpdateLocalAndRemoteData = (localArray) => {
    let coordinates = {
      coordinates: localArray,
      cursorPoints: [],
      identity: userId,
      isDrawing: false,
    };
    let arr = localArray.map((item) => {
      return { ...item };
    });
    if (localArray.length) {
      arr.push(coordinates);
    }

    dispatch(
      saveAllWhiteBoardData({
        index: whiteBoardData.currentIndex,
        whiteBoardData: arr,
        dataTrackKey: LESSON.lessonWhiteBoardData,
      })
    );
  };
  const afterImageRendered = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      setIsImageLoaded(false);
    }
  }, [whiteBoardData.currentIndex]);
  if (!imageUrl?.length)
    return (
      <>
        <h3>Could not find the lesson.</h3>
      </>
    );

  const handleClearButton = () => {
    if (childRef.current) {
      childRef.current();
    }
  };

  return (
    <React.Fragment key={`${tagId}`}>
      <div
        className={`${isImageLoaded ? "visible" : "invisible"} relative m-auto`}
        style={{
          height: isImageLoaded
            ? "fit-content"
            : `${
                isTutorTechBoth({ identity: String(role_name) })
                  ? "calc(100% - 50px)"
                  : "100%"
              }  `,
          width: isImageLoaded ? "fit-content" : "100%",
        }}
      >
        <WhiteBoard
          childRef={childRef}
          images={imageUrl[whiteBoardData.currentIndex]}
          whiteBoardData={
            whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
          }
          currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
          handleDataTrack={handleDataTrack}
          handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
          count={whiteBoardData.whiteBoardCounts}
          key={whiteBoardData.currentIndex}
          cbAfterImageRendered={afterImageRendered}
          totalImageLength={imageUrl.length}
          currentPdfIndex={whiteBoardData.currentIndex}
          removeClearAllBtn={
            isTutorTechBoth({ identity: role_name.toString() }) ? false : true
          }
          from=""
        />
      </div>
      <div className="flex flex-row w-full h-[50px] justify-center items-center">
        {isTutorTechBoth({ identity: String(role_name) }) && isImageLoaded && (
          <>
            <div className="flex w-[28px] h-[28px] justify-center items-center bg-[#000] hover:bg-[#292929] rounded-full">
              <button
                onClick={() => handleClearButton()}
                className="flex justify-center items-center"
              >
                <LessonDeleteIcon />
              </button>
            </div>
            <div className="flex gap-2 w-[56px] h-[28px] justify-center items-center ml-[5px] bg-[#000]  rounded-full">
              <button
                onClick={() => {
                  handlePdfChange(-1);
                }}
                className="flex hover:bg-[#292929] w-[24px] h-[24px] rounded-full"
              >
                <LessonPreviousIcon />
              </button>
              <button
                onClick={() => {
                  handlePdfChange(1);
                }}
                className="flex hover:bg-[#292929] w-[24px] h-[24px] rounded-full"
              >
                <LessonNextIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
}
