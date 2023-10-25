import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TwilioError } from "twilio-video";
import defaultRouter from "../../Router/defaultRouter";

import { RoomType } from "../../types";

interface liveClassDetailsTypes {
  userId: number;
  liveClassId: number;
  currentSelectedScreen: string;
  userIdentity: string;
  userName: string;
  studentsAssignInClass: string[];
  cameraLocalParticipant: boolean;
  audioLocalPariticipant: boolean;
  value: string[];
  twilioConnection: string;
  error: TwilioError | Error | null;
  isFetching: boolean;
  activeSinkId: string;
  roomType?: RoomType;
  isGalleryViewActive: boolean;
  maxGalleryViewParticipants: number;
  isKrispEnabled: boolean;
  isKrispInstalled: boolean;
  roomToken: string;
  techJoinedClass: boolean;
  parentJoinedClass: boolean;
  muteAllParticipant: boolean | undefined;
  videoPlayState: boolean;
  remoteParticipantCount: number;
  speedMathGameIdStudent: number;
  speedMathGameLevel: number;
  speedMathPlayMode: string;
  speedMathScoreofAllParticipant: any;
  isRecordingEnabled: boolean;
  isClassHasDisconnected: boolean;
  muteIndividualParticipant: any;
  openUploadResourceModal: boolean;
  participantDeviceInformation: string[];
  showDeviceInfoModalTech: boolean;
  isGgb: boolean;
  mathCurrentVideoPlaying: object;
  isMenuOpen: boolean;
  studentScreenShareReceived: boolean;
  screenSharePermissionDenied: object;
  showFiveStarAnimation: boolean;
  openSafariModalForScreenShare: boolean;
  screenShareStatus: boolean;
  uploadResourceDeleteModal: boolean;
}

const initialState: liveClassDetailsTypes = {
  userId: 0,
  liveClassId: 0,
  currentSelectedScreen: defaultRouter.path,
  userIdentity: "",
  userName: "",
  studentsAssignInClass: [],
  cameraLocalParticipant: false,
  audioLocalPariticipant: false,
  value: [],
  twilioConnection: "",
  error: null,
  isFetching: false,
  activeSinkId: "",
  roomType: "group",
  isGalleryViewActive: false,
  maxGalleryViewParticipants: 4,
  isKrispEnabled: false,
  isKrispInstalled: false,
  roomToken: "",
  techJoinedClass: false,
  parentJoinedClass: false,
  muteAllParticipant: undefined,
  videoPlayState: false,
  remoteParticipantCount: 0,
  speedMathGameIdStudent: 0,
  speedMathGameLevel: 0,
  speedMathPlayMode: "",
  speedMathScoreofAllParticipant: [],
  isRecordingEnabled: false,
  isClassHasDisconnected: false,
  muteIndividualParticipant: [],
  openUploadResourceModal: false,
  participantDeviceInformation: [],
  showDeviceInfoModalTech: false,
  isGgb: false,
  mathCurrentVideoPlaying: {
    currentVideoTime: 0,
    currentVideoTagId: 0,
  },
  isMenuOpen: false,
  studentScreenShareReceived: false,
  screenSharePermissionDenied: {
    status: false,
    identity: "",
  },
  showFiveStarAnimation: false,
  openSafariModalForScreenShare: false,
  screenShareStatus: false,
  uploadResourceDeleteModal: false,
};

export const liveClassDetailsSlice = createSlice({
  name: "liveClassDetails",
  initialState,
  reducers: {
    addDetails: (state, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    addUserId: (state, action) => {
      return { ...state, userId: action.payload };
    },
    addLiveClassId: (state, action) => {
      return { ...state, liveClassId: action.payload };
    },
    addCurrentSelectedScreen: (state, action) => {
      return { ...state, currentSelectedScreen: action.payload };
    },
    addKrispInstalledEnabledDetails: (state, action) => {
      const { isKrispEnabled, isKrispInstalled } = action.payload;
      state.isKrispEnabled = isKrispEnabled;
      state.isKrispInstalled = isKrispInstalled || true;
    },
    addTechJoinedClass: (state, action) => {
      state.techJoinedClass = action.payload;
    },

    addParentJoinedClass: (state, action) => {
      state.parentJoinedClass = action.payload;
    },
    addMuteAllParticipant: (state, action) => {
      state.muteAllParticipant = action.payload;
    },
    addVideoPlayState: (state, action) => {
      const { muteAllState, videoPlayState } = action.payload;
      state.videoPlayState = videoPlayState;
      state.muteAllParticipant = muteAllState;
    },
    addRemoteParticipantCount: (state, action) => {
      state.remoteParticipantCount = action.payload;
    },
    addSpeedMathGameStartDetails: (state, action) => {
      const { speedMathGameId, speedMathGameLevel, speedMathPlayMode } =
        action.payload;

      state.speedMathGameIdStudent = speedMathGameId;
      state.speedMathGameLevel = speedMathGameLevel;
      state.speedMathPlayMode = speedMathPlayMode;
    },

    addSpeedMathScoreOfAllParticipant: (state, action) => {
      const { identity, userId, currentUserScoreSpeedMath, resetScore } =
        action.payload;

      let prevArr = state.speedMathScoreofAllParticipant;

      if (resetScore) {
        state.speedMathScoreofAllParticipant = [];
      }

      if (prevArr.length === 0 && !resetScore) {
        prevArr.push({
          userId,
          identity,
          currentUserScoreSpeedMath,
        });
      } else {
        let identityNotFound = true;
        for (let i = 0; i < prevArr.length; i++) {
          if (prevArr[i]?.userId === userId) {
            prevArr[i].currentUserScoreSpeedMath = currentUserScoreSpeedMath;
            identityNotFound = false;
            break;
          }
        }
        if (identityNotFound) {
          prevArr.push({
            userId,
            identity,
            currentUserScoreSpeedMath,
          });
        }
      }
    },
    startAndStopRecordingRecording: (state, action) => {
      const { payload } = action;
      state.isRecordingEnabled = payload;
    },
    endRoomRequest: (state, action) => {
      const { payload } = action;
      state.isClassHasDisconnected = payload;
    },

    addMuteIndividualParticipant: (state, action) => {
      const { identity, muteStatus, fromScreen } = action.payload;

      let prevArr = state.muteIndividualParticipant;

      if (prevArr.length === 0) {
        prevArr.push({
          identity,
          muteStatus,
          fromScreen,
        });
      } else {
        let identityNotFound = true;

        for (let i = 0; i < prevArr.length; i++) {
          if (prevArr[i]?.identity === identity) {
            prevArr[i].muteStatus = muteStatus;
            prevArr[i].fromScreen = fromScreen;
            identityNotFound = false;
            break;
          }
        }

        if (identityNotFound) {
          prevArr.push({
            identity,
            muteStatus,
            fromScreen,
          });
        }
      }
    },

    openCloseUploadResourceModalTeacher: (state, action) => {
      state.openUploadResourceModal = action.payload;
    },

    updateParticipantDeviceInformation: (state, action) => {
      state.participantDeviceInformation = action.payload;
    },

    openCloseShowDeviceInfoModalTech: (state, action) => {
      state.showDeviceInfoModalTech = action.payload;
    },
    changeGGbStatus: (state, action) => {
      const { payload } = action;
      state.isGgb = payload;
    },
    updateMathVideoCurrentTime: (state, action) => {
      state.mathCurrentVideoPlaying.currentVideoTime =
        action.payload.currentVideoTime;
      state.mathCurrentVideoPlaying.currentVideoTagId =
        action.payload.currentVideoTagId;
    },
    toggleMenuBar: (state, action) => {
      state.isMenuOpen = action.payload;
    },

    setStudentScreenShareReceived: (state, action) => {
      state.studentScreenShareReceived = action.payload;
    },
    setScreenSharePermission: (state, action) => {
      const { status, identity } = action.payload;
      state.screenSharePermissionDenied.status = status;
      state.screenSharePermissionDenied.identity = identity;
    },

    setShowFiveStarAnimation: (state, action) => {
      state.showFiveStarAnimation = action.payload;
    },
    setSafariModalForScreenShare: (state, action) => {
      state.openSafariModalForScreenShare = action.payload;
    },

    setScreenShareStatus: (state, action) => {
      state.screenShareStatus = action.payload;
    },

    toggleUploadResourceDeleteModal: (state, action) => {
      state.uploadResourceDeleteModal = action.payload;
    },
  },
});

export const {
  addDetails,
  addUserId,
  addLiveClassId,
  addCurrentSelectedScreen,
  addKrispInstalledEnabledDetails,
  addTechJoinedClass,
  addParentJoinedClass,
  addMuteAllParticipant,
  addVideoPlayState,
  addRemoteParticipantCount,
  addSpeedMathGameStartDetails,
  addSpeedMathScoreOfAllParticipant,
  startAndStopRecordingRecording,
  endRoomRequest,
  addMuteIndividualParticipant,
  openCloseUploadResourceModalTeacher,
  updateParticipantDeviceInformation,
  openCloseShowDeviceInfoModalTech,
  changeGGbStatus,
  updateMathVideoCurrentTime,
  toggleMenuBar,
  setStudentScreenShareReceived,
  setScreenSharePermission,
  setShowFiveStarAnimation,
  setSafariModalForScreenShare,
  setScreenShareStatus,
  toggleUploadResourceDeleteModal,
} = liveClassDetailsSlice.actions;

export default liveClassDetailsSlice.reducer;
