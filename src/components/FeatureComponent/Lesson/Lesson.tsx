import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { LESSON, ROUTERKEYCONST, WHITEBOARD } from "../../../constants";
import React, { useEffect, useState } from "react";
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
export default function Lesson() {
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
    if (localArray.length) {
      arr.push(coordinates);
    }

    if (arr.length) {
      dispatch(
        saveAllWhiteBoardData({
          index: whiteBoardData.currentIndex,
          whiteBoardData: arr,
          dataTrackKey: LESSON.lessonWhiteBoardData,
        })
      );
    }
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

  return (
    <React.Fragment key={`${tagId}`}>
      <div
        className={`${
          isImageLoaded ? "w-fit h-fit visible" : "w-full h-full invisible"
        } relative m-auto`}
      >
        {isTutorTechBoth({ identity: String(role_name) }) && isImageLoaded && (
          <div
            className="absolute top-1/2 left-[-40px] flex w-full justify-between"
            style={{
              width: "calc(100% + 80px)",
            }}
          >
            <button
              onClick={() => {
                handlePdfChange(-1);
              }}
            >
              <img src="/static/media/Previous-btn.svg" />
            </button>
            <button
              onClick={() => {
                handlePdfChange(1);
              }}
            >
              <img src="/static/media/Next-btn.svg" />
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
          cbAfterImageRendered={afterImageRendered}
          totalImageLength={imageUrl.length}
          currentPdfIndex={whiteBoardData.currentIndex}
        />
      </div>
    </React.Fragment>
  );
}
