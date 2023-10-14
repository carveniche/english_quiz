import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import WhiteboardImageRender from "../../WhiteBoardHelper/WhiteboardImageRenderer/WhiteboardImageRender";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { GGB, LESSON, ROUTERKEYCONST, WHITEBOARD } from "../../../constants";
import React, { useRef } from "react";
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
import Geogebra from "./GeogebraLesson/Geogebra";

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
  const { imageUrl, tagType } = extraParams || [];
  const handleDataTrack = (coordinates) => {
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
      saveAllWhiteBoardData({
        index: whiteBoardData.currentIndex,
        whiteBoardData: arr,
        dataTrackKey: LESSON.lessonWhiteBoardData,
      })
    );
  };
  if (!imageUrl?.length)
    return (
      <>
        <h3>Could not find the lesson.</h3>
      </>
    );
  if (tagType === GGB.type)
    return (
      <>
        <Geogebra />
      </>
    );
  return (
    <React.Fragment key={`${extraParams?.tagId || 1}`}>
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
      <WhiteBoard
        images={imageUrl[whiteBoardData.currentIndex]}
        whiteBoardData={
          whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
        }
        currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
        handleDataTrack={handleDataTrack}
        handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
        count={whiteBoardData.whiteBoardCounts}
        key={whiteBoardData.currentIndex}
      />
    </React.Fragment>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
