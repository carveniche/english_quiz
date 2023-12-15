import React, { useEffect, useRef, useState } from "react";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ROUTERKEYCONST, UPLOADRESOURCE, WHITEBOARD } from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import { changePdfIndex } from "../../../redux/features/ComponentLevelDataReducer";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";
import LessonPreviousIcon from "../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonPreviousIcon";
import LessonNextIcon from "../../WhiteBoardHelper/WhiteBoardLessonIcons/LessonNextIcon";
import { Tooltip } from "@material-ui/core";

export default function UploadResourceWhiteBoard() {
  const childRef = useRef(null);
  const { room } = useVideoContext();
  const { allWhiteBoardRelatedData, uploadResourceImagesId } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const dataTrackKey = `${UPLOADRESOURCE.uploadResourceWhiteboardData}${uploadResourceImagesId}`;
  let whiteBoardData = allWhiteBoardRelatedData[dataTrackKey] || {};
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];
  const { uploadResourceImages } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const dispatch = useDispatch();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { currentSelectedRouter } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const showUploadResourceLessonThrottleTooltip =
    isButtonDisabled && [0, 1].includes(whiteBoardData?.currentIndex);

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
      whiteBoardData.currentIndex + val < uploadResourceImages.length &&
      whiteBoardData.currentIndex + val >= 0
    ) {
      let DataTrackObj = {
        pathName: ROUTERKEYCONST.whiteboard.path,
        key: ROUTERKEYCONST.whiteboard.key,
        value: {
          datatrackName: WHITEBOARD.pdfIndex,
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: dataTrackKey,
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      dispatch(
        changePdfIndex({
          index: whiteBoardData.currentIndex + val,
          dataTrackKey: dataTrackKey,
        })
      );
      setIsImageLoaded(false);
    }
  };
  const afterImageRendered = () => {
    console.log("loaded");
    setIsImageLoaded(true);
  };

  useEffect(() => {
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      setIsImageLoaded(false);
    }
  }, [whiteBoardData.currentIndex]);

  // const handleClearButton = () => {
  //   if (childRef.current) {
  //     childRef.current();
  //   }
  // };

  return (
    <div
      className={`${
        isImageLoaded ? "w-full h-full visible" : "w-full h-full invisible"
      } relative m-auto`}
      key={uploadResourceImagesId}
    >
      {isTutorTechBoth({ identity: String(role_name) }) &&
        isImageLoaded &&
        uploadResourceImages.length > 1 && (
          <div className="absolute bottom-0 right-1/2 flex justify-center items-center z-10 mb-2">
            <>
              <div className="flex gap-2 w-[56px] h-[28px] justify-center items-center ml-[5px] bg-[#000]  rounded-full">
                <Tooltip
                  title="Wait for 5 seconds before pressing again"
                  open={showUploadResourceLessonThrottleTooltip}
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
          </div>
        )}
      <HelperWhiteBoard
        childRef={childRef}
        dataTrackKey={dataTrackKey}
        pathName={currentSelectedRouter}
        key={uploadResourceImages[whiteBoardData.currentIndex]}
        cbAfterImageRendered={afterImageRendered}
        isCico={false}
        isWritingDisabled={false}
        images={uploadResourceImages}
        removeClearAllBtn={
          isTutorTechBoth({ identity: role_name.toString() }) ? false : true
        }
        from="uploadResource"
      />
    </div>
  );
}
