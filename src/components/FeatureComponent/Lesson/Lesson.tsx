import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import WhiteboardImageRender from "../../WhiteBoard/WhiteboardImageRenderer/WhiteboardImageRender";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { LESSON, ROUTERKEYCONST } from "../../../constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  currentLessonPdfIndexUpdate,
  lessonWhiteboardComponentLevelDataTrack,
  saveAllLessonWhiteBoardData,
} from "../../../redux/features/ComponentLevelDataReducer";
import { isTutor, isTutorTechBoth } from "../../../utils/participantIdentity";

export default function Lesson() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const whiteBoardRef = useRef([]);
  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];

  const dispatch = useDispatch();
  const {
    remoteLessonDataWhiteBoardData,
    lessonWhiteBoardCounts,
    lessonWhiteBoardData,
    currentLessonIndex,
  } = useSelector((state: RootState) => state.ComponentLevelDataReducer);
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { extraParams } = activeTabArray[currentSelectedIndex];
  const { imageUrl } = extraParams || [];
  const handleDataTrack = (coordinates) => {
    coordinates.index = currentLessonIndex;
    coordinates.identity = userId;
    let DataTrackObj = {
      pathName: ROUTERKEYCONST.lesson,
      key: ROUTERKEYCONST.lesson,
      value: {
        identity: userId,
        datatrackName: LESSON.LessonDataTrack,
        whiteBoardPoints: coordinates,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handlePdfChange = (val: number) => {
    if (
      currentLessonIndex + val < imageUrl.length &&
      currentLessonIndex + val >= 0
    ) {
      let DataTrackObj = {
        pathName: ROUTERKEYCONST.lesson,
        key: ROUTERKEYCONST.lesson,
        value: {
          datatrackName: LESSON.LessonIndexChange,
          index: currentLessonIndex + val,
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      dispatch(currentLessonPdfIndexUpdate(currentLessonIndex + val));
    }
  };
  const handleUpdateLocalAndRemoteData = (localArray, remoteArray) => {
    let coordinates = {
      coordinates: localArray,
      cursorPoints: [],
      identity: userId,
      isDrawing: false,
    };
    let arr = remoteArray.map((item) => {
      return { ...item, cursorPoints: [], isDrawing: false };
    });
    arr.push(coordinates);
    dispatch(
      saveAllLessonWhiteBoardData({
        index: currentLessonIndex,
        whiteBoardData: arr,
      })
    );
  };
  return (
    <>
      {isTutorTechBoth({ identity: String(role_name) }) && (
        <div>
          <button
            onClick={() => {
              handlePdfChange(-1);
            }}
          >
            Prev
          </button>
          <button
            onClick={() => {
              handlePdfChange(1);
            }}
          >
            Next
          </button>
        </div>
      )}
      <WhiteboardImageRender
        images={imageUrl[currentLessonIndex]}
        whiteBoardData={lessonWhiteBoardData[currentLessonIndex] || []}
        currentIncomingLines={remoteLessonDataWhiteBoardData}
        handleDataTrack={handleDataTrack}
        handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
        count={lessonWhiteBoardCounts}
        key={currentLessonIndex}
      />
    </>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
