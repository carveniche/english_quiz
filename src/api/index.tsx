import BaseUrl from "./ApiConfig.js";
import axios from "axios";

export const videoCallToken = async (user: Number, live_class_id: Number) => {
  axios.get(BaseUrl + "app_students/video_call_token", {
    params: {
      user,
      live_class_id,
    },
  });
};
