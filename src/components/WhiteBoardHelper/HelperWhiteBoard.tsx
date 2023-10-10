import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { WHITEBOARD } from "../../constants";
import { saveAllWhiteBoardData } from "../../redux/features/ComponentLevelDataReducer";
import WhiteBoard from "./WhiteBoard";
import ActivityWhiteBoard from "./ActivityWhiteBoard";

export default function HelperWhiteBoard({
  dataTrackKey,
  pathName,
  key,
  isCico,
  images,
  whiteBoardRef,
}: {
  dataTrackKey: string;
  pathName: string;
  key: string;
  isCico: boolean | undefined | null;
  images: [];
}) {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];

  const dispatch = useDispatch();
  const { allWhiteBoardRelatedData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let whiteBoardData = allWhiteBoardRelatedData[dataTrackKey] || {};
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { extraParams } = activeTabArray[currentSelectedIndex];
  const handleDataTrack = (coordinates) => {
    coordinates.index = whiteBoardData.currentIndex;
    coordinates.identity = userId;
    let DataTrackObj = {
      pathName: pathName,
      key: key,
      value: {
        identity: userId,
        datatrackName: WHITEBOARD.whiteBoardData,
        whiteBoardData: coordinates,
        dataTrackKey: dataTrackKey,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
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
        dataTrackKey: dataTrackKey,
      })
    );
  };
  return (
    <>
      {isCico ? (
        <ActivityWhiteBoard
          images={images}
          whiteBoardData={
            whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
          }
          currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
          handleDataTrack={handleDataTrack}
          handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
          count={whiteBoardData.whiteBoardCounts}
          key={whiteBoardData.currentIndex}
          whiteBoardRef={whiteBoardRef}
        />
      ) : (
        <WhiteBoard
          images=""
          whiteBoardData={
            whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
          }
          currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
          handleDataTrack={handleDataTrack}
          handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
          count={whiteBoardData.whiteBoardCounts}
          key={whiteBoardData.currentIndex}
        />
      )}
    </>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
