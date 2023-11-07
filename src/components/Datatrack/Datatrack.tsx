import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { DataTrack as IDataTrack } from "twilio-video";
import { getQueryParams } from "../../utils/getQueryParams";
import { useDispatch } from "react-redux";
import {
  addAnimationDatatrack,
  addChatMessageDataTrack,
  addScreenShareDatatrack,
} from "../../redux/features/dataTrackStore";
import {
  addToActiveTab,
  deleteFromActiveTab,
} from "../../redux/features/addActiveTabLink";
import {
  addMuteAllParticipant,
  addVideoPlayState,
  addSpeedMathGameStartDetails,
  addSpeedMathScoreOfAllParticipant,
  addTechJoinedClass,
  addMuteIndividualParticipant,
  updateMathVideoCurrentTime,
  setScreenSharePermission,
  setStudentScreenShareReceived,
} from "../../redux/features/liveClassDetails";
import {
  CICO,
  FLAGGEDQUESTIONKEY,
  GGB,
  HOMEWORKQUESTIONKEY,
  MATHZONEDATAKEY,
  ROUTERKEYCONST,
  UPLOADRESOURCE,
  WHITEBOARD,
} from "../../constants";
import {
  changeGGbMode,
  changeMathzoneData,
  changePdfIndex,
  cicoComponentLevelDataTrack,
  closeUploadResourceWhiteboard,
  flagQuestionDetailsStore,
  ggbDataTrack,
  homeWorkQuestionDataTrack,
  openCloseIncorrectMathzoneQuestion,
  openClosedMathzoneWhiteBoard,
  openClosedScratchWhiteBoard,
  openClosedUploadResourceWhiteBoard,
  resetWhiteBoardData,
  toggleGraphWhiteboard,
  whiteBoardComponentLevelDataTrack,
} from "../../redux/features/ComponentLevelDataReducer";

export default function DataTrack({ track }: { track: IDataTrack }) {
  const { pathname } = useLocation();
  const history = useNavigate();
  const queryParams = getQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (message: string) => {
      let parseMessage = JSON.parse(message);
      if (
        pathname === parseMessage.pathName ||
        parseMessage.pathName === null
      ) {
        if (parseMessage.value.type === "deleteFromActiveTab") {
          dispatch(deleteFromActiveTab(parseMessage.pathName));
        }
      } else {
        if (parseMessage.value.type === "deleteFromActiveTab") {
          dispatch(deleteFromActiveTab(parseMessage.pathName));
        } else if (parseMessage.value.type === "addFromActiveTab") {
          history(`${parseMessage.pathName}?${queryParams}`);
          dispatch(
            addToActiveTab({
              path: parseMessage.pathName,
              key: parseMessage.key,
              icon: parseMessage.icon,
              name: parseMessage.name,
              extraParams: parseMessage.extraParams || {},
            })
          );
        }
      }

      if (parseMessage?.value?.datatrackName === "ScreenShare") {
        dispatch(addScreenShareDatatrack(parseMessage.value));
      } else if (
        parseMessage.value.datatrackName === "ScreenSharePermissionDenied"
      ) {
        dispatch(
          setScreenSharePermission({
            status: parseMessage?.value?.status,
            identity: parseMessage?.value?.identity,
          })
        );

        dispatch(setStudentScreenShareReceived(false));
      } else if (parseMessage.value.datatrackName === "Animations") {
        dispatch(addAnimationDatatrack(parseMessage.value));
      } else if (parseMessage.value.datatrackName === "ChatMessage") {
        dispatch(addChatMessageDataTrack(parseMessage.value.messageArray));
      } else if (parseMessage.value.datatrackName === "MuteAllToggle") {
        dispatch(addMuteAllParticipant(parseMessage.value.muteState));
      } else if (parseMessage.value.datatrackName === "MuteParticipant") {
        dispatch(
          addMuteIndividualParticipant({
            identity: parseMessage.value.identity,
            muteStatus: parseMessage.value.muteStatus,
            fromScreen: parseMessage.value.fromScreen,
          })
        );
      } else if (
        parseMessage?.value?.type === MATHZONEDATAKEY.mathzoneQuestionData
      ) {
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );
        dispatch(changeMathzoneData(parseMessage.value.mathzoneData));
      } else if (
        parseMessage?.value?.type === MATHZONEDATAKEY.openClosedWhiteBoard
      ) {
        dispatch(
          openClosedMathzoneWhiteBoard(
            parseMessage.value.isMathZoneWhiteBoard || false
          )
        );
      } else if (
        parseMessage?.value?.type === MATHZONEDATAKEY.viewIncorrectQuestion
      ) {
        dispatch(
          openCloseIncorrectMathzoneQuestion(parseMessage.value?.data || {})
        );
      } else if (
        parseMessage?.value?.type === FLAGGEDQUESTIONKEY.flaggedQuestionMenu
      ) {
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );
        dispatch(
          flagQuestionDetailsStore(
            parseMessage?.value?.flaggedQuestionData || {}
          )
        );
      } else if (parseMessage?.value?.datatrackName === "PlayVideo") {
        dispatch(
          addToActiveTab({
            path: parseMessage.pathName,
            key: parseMessage.key,
            icon: parseMessage.icon,
            name: parseMessage.name,
            extraParams: parseMessage.extraParams || {},
          })
        );
      } else if (parseMessage?.value?.datatrackName === "MathLesson") {
        if (parseMessage?.value?.isReset) {
          dispatch(
            resetWhiteBoardData({
              dataTrackKey: parseMessage?.value?.dataTrackKey,
            })
          );
        }
        dispatch(
          addToActiveTab({
            path: parseMessage.pathName,
            key: parseMessage.key,
            icon: parseMessage.icon,
            name: parseMessage.name,
            extraParams: parseMessage.extraParams || {},
          })
        );
      } else if (parseMessage?.value?.datatrackName === "PlayVideoState") {
        dispatch(
          addVideoPlayState({
            muteAllState: parseMessage.value.muteState,
            videoPlayState: parseMessage.value.videoPlayState,
          })
        );
      } else if (
        parseMessage?.value?.datatrackName === "UpdatePlayVideoTiming"
      ) {
        dispatch(
          updateMathVideoCurrentTime({
            currentVideoTime: parseMessage?.value?.currentVideoTime,
            currentVideoTagId: parseMessage?.value?.currentVideoTagId,
          })
        );
        dispatch(
          addVideoPlayState({
            videoPlayState: false,
          })
        );
      } else if (parseMessage?.value?.datatrackName === "SpeedMath") {
        dispatch(
          addToActiveTab({
            path: parseMessage.pathName,
            key: parseMessage.key,
            icon: parseMessage.icon,
            name: parseMessage.name,
            extraParams: parseMessage.extraParams || {},
          })
        );
      } else if (parseMessage?.value?.datatrackName === "SpeedMathGameStart") {
        dispatch(
          addSpeedMathGameStartDetails({
            speedMathGameId: parseMessage?.value?.speedMathGameId,
            speedMathGameLevel: parseMessage?.value?.speedMathGameLevel,
            speedMathPlayMode: parseMessage?.value?.speedMathPlayMode,
          })
        );
      } else if (parseMessage?.value?.datatrackName === "techJoinedClass") {
        dispatch(addTechJoinedClass(true));
      } else if (
        parseMessage?.value?.datatrackName ===
        "updateSpeedMathScoreToOtherParticipant"
      ) {
        dispatch(
          addSpeedMathScoreOfAllParticipant({
            identity: parseMessage?.value?.identity,
            userId: parseMessage?.value?.userId,
            currentUserScoreSpeedMath:
              parseMessage?.value?.currentUserScoreSpeedMath,
          })
        );
      } else if (
        parseMessage?.value?.datatrackName === ROUTERKEYCONST.whiteboard.key
      ) {
        dispatch(
          whiteBoardComponentLevelDataTrack(
            parseMessage?.value?.whiteBoardPoints || []
          )
        );
      } else if (
        parseMessage?.value?.datatrackName === WHITEBOARD.whiteBoardData
      ) {
        dispatch(whiteBoardComponentLevelDataTrack(parseMessage?.value || {}));
      } else if (parseMessage?.value?.datatrackName === GGB.dataTrackName) {
        dispatch(ggbDataTrack(parseMessage?.value || {}));
      } else if (parseMessage?.value?.datatrackName === GGB.ggbChangeMode) {
        dispatch(changeGGbMode(parseMessage?.value?.currentMode || "tutor"));
      } else if (parseMessage?.value?.datatrackName === WHITEBOARD.pdfIndex) {
        dispatch(changePdfIndex(parseMessage?.value || {}));
      } else if (parseMessage?.value?.datatrackName === WHITEBOARD.openGraph) {
        dispatch(
          toggleGraphWhiteboard(parseMessage?.value?.openGraphState || false)
        );
      } else if (
        parseMessage?.value?.type ===
        HOMEWORKQUESTIONKEY.homeWorkQuestionDataTrack
      ) {
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );
        dispatch(
          homeWorkQuestionDataTrack(
            parseMessage?.value?.HomeWorkQuestionData || {}
          )
        );
      } else if (
        parseMessage?.value?.type === CICO.checkIn ||
        parseMessage?.value?.type === CICO.checkOut
      ) {
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );

        dispatch(
          cicoComponentLevelDataTrack(parseMessage?.value?.cicoData || {})
        );
      } else if (
        parseMessage?.value?.datatrackName === "openCloseScratchWhiteBoard"
      ) {
        dispatch(openClosedScratchWhiteBoard(parseMessage?.value || {}));
      } else if (parseMessage?.value?.datatrackName === "UploadResource") {
        dispatch(
          openClosedUploadResourceWhiteBoard({
            images: parseMessage?.value?.images || [],
            id: parseMessage?.value?.id,
          })
        );
      } else if (
        parseMessage?.value?.datatrackName ===
        UPLOADRESOURCE.closeUploadResource
      ) {
        dispatch(closeUploadResourceWhiteboard(false));
      }
    };

    track.on("message", handleMessage);
    return () => {
      track.off("message", handleMessage);
    };
  }, [track, pathname]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
