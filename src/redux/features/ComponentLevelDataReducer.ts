import { createSlice } from "@reduxjs/toolkit";
import {
  MAINWHITEBOARD,
  MATHZONEDATAKEY,
  MISCELLANEOUS,
  SCRATCHLESSON,
  SHAPECHALLENGE,
  UPLOADRESOURCE,
} from "../../constants";

interface localLessonWhiteboardProps {
  currentIndex: number;
  identity: string;
  imagePoints: object;
}
interface remoteLessonDataWhiteBoardDataProps {
  identity: string;
  imagePoints: object;
  currentIndex: number;
}
export interface ComponentLevelData {
  mathzone: object;
  flaggedQuestion: object;
  otherData: otherData;
  remoteLessonDataWhiteBoardData: object;
  localLessonDataWhiteBoardData: localLessonWhiteboardProps;
  lessonWhiteBoardCount: number;
  lessonWhiteBoardData: remoteLessonDataWhiteBoardDataProps[];
  isMathZoneWhiteBoard: boolean;
}
interface otherData {
  [key: string]: string | number | object;
}
let defaultParameterWhiteBoard={
  currentIndex: 0,
  remoteWhiteBoardData: {},
  whiteBoardData: [],
  whiteBoardCounts: 0,
  isRemoteReceived:false
}
const initialState = {
  mathzone: {},
  isMathZoneWhiteBoard: false,
  flaggedQuestion: {},
  otherData: {},
  whiteBoardData: {},
  isScratchOpenStatus: false,
  scratchPdfsImages: [],
  uploadResourceImages: [],
  isUploadResourceOpen: false,
  allWhiteBoardRelatedData: {
    lessonWhiteBoardData: {
      currentIndex: 0,
      remoteWhiteBoardData: {},
      whiteBoardData: [],
      whiteBoardCounts: 0,
    },

    [SCRATCHLESSON.scratchWhiteBoardData]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),
    [MATHZONEDATAKEY.mathzoneWhiteBoardData]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),
    [MISCELLANEOUS.miscellaneousDataWhiteBoard]:JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),
    [MAINWHITEBOARD.mainWhiteBoardData]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),
    [SHAPECHALLENGE.shapeChallengeCheckInWhiteBoard]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),

    [SHAPECHALLENGE.shapeChallengeCheckOutWhiteBoard]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),

    [UPLOADRESOURCE.uploadResourceWhiteboardData]: JSON.parse(JSON.stringify(defaultParameterWhiteBoard)),
  },
  ggbData:{
    currentIdentity:"",
    currentCount:0,
    currentRole:"",
    currentMode:"tutor",
    currentSelectedStudentId:""
  }
};

const ComponentLevelDataReducer = createSlice({
  name: "ComponentLevelData",
  initialState,
  reducers: {
    changeMathzoneData: (state: ComponentLevelData, action: any) => {
      state.mathzone = action.payload || {};
    },
    flagQuestionDetailsStore: (state: ComponentLevelData, action: any) => {
      const { payload } = action;

      if (payload?.isFetchAgain) {
        payload.currentFetchTime = Number(
          !(state?.flaggedQuestion?.currentFetchTime || "")
        );
      }
      state.flaggedQuestion = payload || {};
    },
    homeWorkQuestionDataTrack: (state: ComponentLevelData, action: any) => {
      const { payload } = action;
      state.otherData = payload || {};
    },
    cicoComponentLevelDataTrack: (state: ComponentLevelData, action: any) => {
      const { payload } = action;
      console.log(payload);
      for (let key in payload) {
        state.otherData[key] = payload[key];
      }
    },
    whiteBoardComponentLevelDataTrack: (state: any, action: any) => {
      const { payload } = action;
      state.allWhiteBoardRelatedData[
        payload.dataTrackKey
      ].remoteWhiteBoardData = payload.whiteBoardData;
      state.allWhiteBoardRelatedData[
        payload.dataTrackKey
      ].whiteBoardCounts += 1;
    },
    changePdfIndex: (state: any, action: any) => {
      const { payload } = action;
      state.allWhiteBoardRelatedData[payload.dataTrackKey].currentIndex =
        Number(payload.index) || 0;
      state.allWhiteBoardRelatedData[payload.dataTrackKey].whiteBoardCounts = 0;
    },
    saveAllWhiteBoardData: (state: any, action: any) => {
      const { payload } = action;
      const { dataTrackKey } = payload;
      let { whiteBoardData } =
        state.allWhiteBoardRelatedData[dataTrackKey] || [];
      whiteBoardData[payload.index] = payload.whiteBoardData;
      whiteBoardData[payload.index].remoteWhiteBoardData = {};
      state.allWhiteBoardRelatedData[payload.dataTrackKey].whiteBoardCounts = 0;
      state.allWhiteBoardRelatedData[dataTrackKey].whiteBoardData =
        whiteBoardData;
    },
    openClosedScratchWhiteBoard: (state, action) => {
      state.isScratchOpenStatus = action.payload.status;
      state.scratchPdfsImages = action.payload.images || [];
    },
    openClosedMathzoneWhiteBoard: (state, action) => {
      console.log(action.payload);
      state.isMathZoneWhiteBoard = action.payload;
    },

    openClosedUploadResourceWhiteBoard: (state, action) => {
      state.isUploadResourceOpen = true;
      state.uploadResourceImages = action.payload || [];
    },
    resetWhiteBoardData: (state, action) => {
      const { payload } = action;
      state.allWhiteBoardRelatedData[payload.dataTrackKey].whiteBoardData = [];
      state.allWhiteBoardRelatedData[
        payload.dataTrackKey
      ].remoteWhiteBoardData = {};
      state.allWhiteBoardRelatedData[payload.dataTrackKey].whiteBoardCounts = 0;
      state.allWhiteBoardRelatedData[payload.dataTrackKey].currentIndex = 0;
    },
    ggbDataTrack:(state,action)=>{
      const {payload}=action
      state.ggbData.currentIdentity=payload.identity
      state.ggbData.currentRole=payload.role
      state.ggbData.currentCount=state.ggbData.currentCount+1
    },
    changeGGbMode:(state,action)=>{
      const {payload}=action
      state.ggbData.currentMode=payload
    },
    changeGgbStudent:(state,action)=>{
      const {payload}=action
      state.ggbData.currentSelectedStudentId=payload
    }
  },
  
});
export const {
  changeMathzoneData,
  flagQuestionDetailsStore,
  homeWorkQuestionDataTrack,
  cicoComponentLevelDataTrack,
  whiteBoardComponentLevelDataTrack,
  saveAllWhiteBoardData,
  changePdfIndex,
  openClosedScratchWhiteBoard,
  openClosedMathzoneWhiteBoard,
  openClosedUploadResourceWhiteBoard,
  resetWhiteBoardData,
  ggbDataTrack,
  changeGGbMode,
  changeGgbStudent
  
} = ComponentLevelDataReducer.actions;
export default ComponentLevelDataReducer.reducer;
