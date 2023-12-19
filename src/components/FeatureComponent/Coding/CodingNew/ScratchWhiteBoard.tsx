import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  changePdfIndex,
  saveAllWhiteBoardData,
} from "../../../../redux/features/ComponentLevelDataReducer";
import { isTutorTechBoth } from "../../../../utils/participantIdentity";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import { RootState } from "../../../../redux/store";
import {
  ROUTERKEYCONST,
  SCRATCHLESSON,
  WHITEBOARD,
} from "../../../../constants";

import WhiteBoard from "../../../WhiteBoardHelper/WhiteBoard";

import LessonNextIcon from "../../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonNextIcon";
import LessonPreviousIcon from "../../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonPreviousIcon";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@material-ui/core";

export default function ScratchWhiteBoard({ pdfImages }: { pdfImages: [] }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const childRef = useRef(null);
  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];

  const dispatch = useDispatch();
  const { allWhiteBoardRelatedData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let whiteBoardData =
    allWhiteBoardRelatedData[SCRATCHLESSON.scratchWhiteBoardData] || {};
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const imageUrl = pdfImages || [];

  const showLessonThrottleTooltip =
    isButtonDisabled && [0, 1].includes(whiteBoardData?.currentIndex);

  const handleDataTrack = (coordinates) => {
    if (coordinates?.type === "pageChange") {
      if (coordinates?.value - 1 === whiteBoardData.currentIndex) {
        return;
      }

      let DataTrackObj = {
        pathName: ROUTERKEYCONST.coding,
        key: ROUTERKEYCONST.coding,
        value: {
          datatrackName: WHITEBOARD.pdfIndex,
          index: coordinates?.value - 1 || 0,
          dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
        },
      };
      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));

      dispatch(
        changePdfIndex({
          index: coordinates?.value - 1 || 0,
          dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
        })
      );

      setIsImageLoaded(false);
      return;
    }
    coordinates.index = whiteBoardData.currentIndex;
    coordinates.identity = userId;
    let DataTrackObj = {
      pathName: ROUTERKEYCONST.coding,
      key: ROUTERKEYCONST.coding,
      value: {
        identity: userId,
        datatrackName: WHITEBOARD.whiteBoardData,
        whiteBoardData: coordinates,
        dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handlePdfChangeThrottled = (val: number) => {
    if (!isButtonDisabled) {
      handlePdfChange(val);
      setIsButtonDisabled(true);

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 5000);
    }
  };

  const handlePdfChange = (val: number) => {
    if (
      whiteBoardData.currentIndex + val < imageUrl.length &&
      whiteBoardData.currentIndex + val >= 0
    ) {
      let DataTrackObj = {
        pathName: ROUTERKEYCONST.coding,
        key: ROUTERKEYCONST.coding,
        value: {
          datatrackName: WHITEBOARD.pdfIndex,
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      dispatch(
        changePdfIndex({
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
        })
      );
      setIsImageLoaded(false);
    }
  };
  const handleUpdateLocalAndRemoteData = (localArray) => {
    let arr = localArray.map((item) => {
      return { ...item };
    });
    dispatch(
      saveAllWhiteBoardData({
        index: whiteBoardData.currentIndex,
        whiteBoardData: arr,
        dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
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

  // const handleClearButton = () => {
  //   if (childRef.current) {
  //     childRef.current();
  //   }
  // };

  return (
    <>
      <div
        className={`${isImageLoaded ? "visible" : "invisible"} relative m-auto`}
        style={{
          height: `${
            isTutorTechBoth({ identity: String(role_name) })
              ? "calc(100% - 50px)"
              : "100%"
          }  `,
          width: "100%",
        }}
      >
        <WhiteBoard
          childRef={childRef}
          images={imageUrl[whiteBoardData.currentIndex]}
          whiteBoardData={
            whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
          }
          currentPdfIndex={whiteBoardData.currentIndex}
          currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
          handleDataTrack={handleDataTrack}
          handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
          cbAfterImageRendered={afterImageRendered}
          totalImageLength={imageUrl.length}
          count={whiteBoardData.whiteBoardCounts}
          key={whiteBoardData.currentIndex}
          removeClearAllBtn={
            isTutorTechBoth({ identity: role_name.toString() }) ? false : true
          }
          from=""
        />
      </div>
      <div className="flex flex-row w-full h-[50px] justify-center items-center">
        {isTutorTechBoth({ identity: String(role_name) }) && isImageLoaded && (
          <>
            <div className="flex gap-2 w-[56px] h-[28px] justify-center items-center ml-[5px] bg-[#000]  rounded-full">
              <Tooltip
                title="Wait for 5 seconds before pressing again"
                open={showLessonThrottleTooltip}
                placement="top"
              >
                <span>
                  <button
                    onClick={() => {
                      handlePdfChangeThrottled(-1);
                    }}
                    className="flex hover:bg-[#292929] w-[24px] h-[24px] rounded-full"
                  >
                    <LessonPreviousIcon />
                  </button>
                </span>
              </Tooltip>

              <button
                onClick={() => {
                  handlePdfChangeThrottled(1);
                }}
                className="flex hover:bg-[#292929] w-[24px] h-[24px] rounded-full"
              >
                <LessonNextIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
