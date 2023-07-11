import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TwilioError } from "twilio-video";

import { RoomType } from "../../types";

interface liveClassDetailsTypes {
  userId: Number;
  liveClassId: Number;
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
}

const initialState: liveClassDetailsTypes = {
  userId: 0,
  liveClassId: 0,
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
  },
});

export const { addDetails, addUserId, addLiveClassId } =
  liveClassDetailsSlice.actions;

export default liveClassDetailsSlice.reducer;
