import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TwilioError } from "twilio-video";

import { RoomType } from "../../types";

interface liveClassDetailsTypes {
  userId: Number;
  liveClassId: Number;
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
  muteAllParticipant: boolean;
}

const initialState: liveClassDetailsTypes = {
  userId: 0,
  liveClassId: 0,
  currentSelectedScreen: "/allScreen",
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
  muteAllParticipant: false,
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
      console.log("Action payload", action.payload);
      state.muteAllParticipant = action.payload;
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
} = liveClassDetailsSlice.actions;

export default liveClassDetailsSlice.reducer;
