import { createSlice } from "@reduxjs/toolkit";
import {
  MAINWHITEBOARD,
  MATHZONEDATAKEY,
  SCRATCHLESSON,
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
}
interface otherData {
  [key: string]: string | number | object;
}
const initialState = {
  mathzone: {},
  flaggedQuestion: {},
  otherData: {},
  whiteBoardData: {},
  isScratchOpenStatus: false,
  scratchPdfsImages: [],
  allWhiteBoardRelatedData: {
    lessonWhiteBoardData: {
      currentIndex: 0,
      remoteWhiteBoardData: {},
      whiteBoardData: [],
      whiteBoardCounts: 0,
    },

    [SCRATCHLESSON.scratchWhiteBoardData]: {
      currentIndex: 0,
      remoteWhiteBoardData: {},
      whiteBoardData: [],
      whiteBoardCounts: 0,
    },
    [MATHZONEDATAKEY.mathzoneWhiteBoardData]: {
      currentIndex: 0,
      remoteWhiteBoardData: {},
      whiteBoardData: [],
      whiteBoardCounts: 0,
    },
    [MAINWHITEBOARD.mainWhiteBoardData]: {
      currentIndex: 0,
      remoteWhiteBoardData: {},
      whiteBoardData: [],
      whiteBoardCounts: 0,
    },
  },
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
    // whiteBoardComponentLevelDataTrack:(state:any,action:any)=>{
    //     const {payload}=action

    //     state.whiteBoardData.whiteBoardsPoints=payload
    //     state.whiteBoardData.count=Number(state.whiteBoardData.count+1)||1
    // },
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
} = ComponentLevelDataReducer.actions;
export default ComponentLevelDataReducer.reducer;
