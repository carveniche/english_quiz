import React, { useEffect, useState } from "react";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ROUTERKEYCONST, UPLOADRESOURCE, WHITEBOARD } from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import { changePdfIndex } from "../../../redux/features/ComponentLevelDataReducer";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";

export default function UploadResourceWhiteBoard() {
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
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { currentSelectedRouter } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

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
  return (
    <div
      className={`${
        isImageLoaded ? "w-fit h-full visible" : "w-full h-full invisible"
      } relative m-auto`}
      key={uploadResourceImagesId}
    >
      {isTutorTechBoth({ identity: String(role_name) }) &&
        isImageLoaded &&
        uploadResourceImages.length > 1 && (
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
      <HelperWhiteBoard
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
