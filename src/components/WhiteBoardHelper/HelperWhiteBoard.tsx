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
  childRef,
  dataTrackKey,
  isCico,
  images,
  whiteBoardRef,
  isWritingDisabled,
  removeClearAllBtn = false,
  cbAfterImageRendered,
  from,
}: {
  childRef: any;
  dataTrackKey: string;
  isCico: boolean | undefined | null;
  images: [];
  isWritingDisabled: boolean | undefined | null;
  removeClearAllBtn: boolean;
  cbAfterImageRendered: Function | undefined | null;
  from: string | undefined | null;
}) {
  // const { activeTabArray, currentSelectedIndex } = useSelector(
  //   (state: RootState) => state.activeTabReducer
  // );
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
    if (coordinates?.type === "toggleGraph") {
      let DataTrackObj = {
        pathName: null,
        key: null,
        value: {
          datatrackName: WHITEBOARD.openGraph,
          openGraphState: coordinates?.openGraphState,
          dataTrackKey: dataTrackKey,
        },
      };
      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      return;
    }
    coordinates.index = whiteBoardData.currentIndex;
    coordinates.identity = userId;
    coordinates.userName = isTutorTechBoth({ identity: `${role_name}` })
      ? role_name
      : isStudentName({ identity: `${role_name}` });
    let DataTrackObj = {
      pathName: null,
      key: null,
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
          isWritingDisabled={isWritingDisabled}
        />
      ) : (
        <WhiteBoard
          childRef={childRef}
          images={
            images?.length ? images[whiteBoardData.currentIndex] || "" : ""
          }
          totalImageLength={images?.length || 0}
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
          from={from}
        />
      )}
    </>
  );
}
