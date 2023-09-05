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
  muteAllParticipant: boolean | undefined;
  videoPlayState: boolean;
  remoteParticipantCount: number;
  speedMathGameIdStudent: number;
  speedMathGameLevel: number;
  speedMathPlayMode: string;
  speedMathScoreofAllParticipant: any;
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
  muteAllParticipant: undefined,
  videoPlayState: false,
  remoteParticipantCount: 0,
  speedMathGameIdStudent: 0,
  speedMathGameLevel: 0,
  speedMathPlayMode: "",
  speedMathScoreofAllParticipant: [],
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
      const { identity, userId, currentUserScoreSpeedMath } = action.payload;

      let prevArr = state.speedMathScoreofAllParticipant;

      console.log("prevArr.length", prevArr.length);

      if (prevArr.length === 0) {
        console.log("h1");
        prevArr.push({
          userId,
          identity,
          currentUserScoreSpeedMath,
        });
      } else {
        for (let i = 0; i < prevArr.length; i++) {
          if (prevArr[i]?.userId === userId) {
            prevArr[i].currentUserScoreSpeedMath = currentUserScoreSpeedMath;
            break;
          } else {
            prevArr.push({
              userId,
              identity,
              currentUserScoreSpeedMath,
            });
          }
        }
      }
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
  addMuteAllParticipant,
  addVideoPlayState,
  addRemoteParticipantCount,
  addSpeedMathGameStartDetails,
  addSpeedMathScoreOfAllParticipant,
} = liveClassDetailsSlice.actions;

export default liveClassDetailsSlice.reducer;
