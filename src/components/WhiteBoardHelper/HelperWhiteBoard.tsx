import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { WHITEBOARD } from "../../constants";
import { saveAllWhiteBoardData } from "../../redux/features/ComponentLevelDataReducer";
import WhiteBoard from "./WhiteBoard";
import ActivityWhiteBoard from "./ActivityWhiteBoard";
import {
  isStudentName,
  isTutorTechBoth,
} from "../../utils/participantIdentity";

export default function HelperWhiteBoard({
  dataTrackKey,
  pathName,
  key,
  isCico,
  images,
  whiteBoardRef,
  isWritingDisabled,
  removeClearAllBtn = false,
  cbAfterImageRendered,
}: {
  dataTrackKey: string;
  pathName: string;
  key: string;
  isCico: boolean | undefined | null;
  images: [];
  isWritingDisabled: boolean | undefined | null;
  removeClearAllBtn: boolean;
  cbAfterImageRendered: Function | undefined | null;
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

  const handleDataTrack = (coordinates) => {
    coordinates.index = whiteBoardData.currentIndex;
    coordinates.identity = userId;
    coordinates.userName = isTutorTechBoth({ identity: `${role_name}` })
      ? role_name
      : isStudentName({ identity: `${role_name}` });
    let DataTrackObj = {
      pathName: pathName,
      key: key,
      value: {
        userName: role_name,
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
    if (localArray.length) {
      arr.push(coordinates);
    }
    arr = arr.filter((item) => item?.coordinates?.length);
    if (arr.length) {
      dispatch(
        saveAllWhiteBoardData({
          index: whiteBoardData.currentIndex,
          whiteBoardData: arr,
          dataTrackKey: dataTrackKey,
        })
      );
    }
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
          isWritingDisabled={isWritingDisabled}
        />
      ) : (
        <WhiteBoard
          images={
            images?.length ? images[whiteBoardData.currentIndex] || "" : ""
          }
          whiteBoardData={
            whiteBoardData.whiteBoardData[whiteBoardData.currentIndex] || []
          }
          currentIncomingLines={whiteBoardData.remoteWhiteBoardData || []}
          handleDataTrack={handleDataTrack}
          handleUpdateLocalAndRemoteData={handleUpdateLocalAndRemoteData}
          count={whiteBoardData.whiteBoardCounts}
          key={whiteBoardData.currentIndex}
          removeClearAllBtn={removeClearAllBtn}
          cbAfterImageRendered={cbAfterImageRendered}
        />
      )}
    </>
  );
}

// same image render last line store

//  remoteArray // saveRedux

// mount remoteArray + localArray => remote
