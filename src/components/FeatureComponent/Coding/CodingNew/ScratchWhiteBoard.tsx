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
import WhiteboardImageRender from "../../../WhiteBoard/WhiteboardImageRenderer/WhiteboardImageRender";

export default function ScratchWhiteBoard({
  pdfImages,
}: {
  pdfImages: object;
}) {
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
  const handleDataTrack = (coordinates) => {
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
        dataTrackKey: SCRATCHLESSON.scratchWhiteBoardData,
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
    </>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
