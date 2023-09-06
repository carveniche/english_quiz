import { createSlice } from "@reduxjs/toolkit";

interface videoCallTokenData {
  [key: string]: videoCallTokenDataStructure;
}

interface videoCallTokenDataStructure {
  class_start_time: string;
  class_type: string;
  country: string;
  demo: boolean;
  env: string;
  grade: string;
  group_class: boolean;
  iso_code: string;
  new_coding_plan: boolean;
  role_name: string;
  room_id: string;
  show_new_codings: boolean;
  status: boolean;
  student_ids: string[];
  students: string[];
  teacher_id: number;
  teacher_name: string;
  time_zone: string;
  token: string;
  user_name: string;
  white_board_url: string;
}

const initialState: videoCallTokenData = {};

export const videoCallTokenDataSlice = createSlice({
  name: "videoCallTokenData",
  initialState,
  reducers: {
    updateVideoCallTokenData: (state, action) => {
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    },
  },
});

export const { updateVideoCallTokenData } = videoCallTokenDataSlice.actions;

export default videoCallTokenDataSlice.reducer;
