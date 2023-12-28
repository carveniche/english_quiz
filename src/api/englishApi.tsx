import BaseUrl from "./ApiConfig.js";
import axios from "axios";
export const imageUrl = "https://www.begalileo.com";

export const getLessonAndMathZoneConceptDetailsEnglish = (prop: {
  live_class_id: string;
}) => {
  return axios.get(BaseUrl + "app_students/english_concept_list", {
    params: {
      ...prop,
    },
  });
};
