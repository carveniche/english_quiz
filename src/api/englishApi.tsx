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

export const startPracticeEnglishQuizZone = (params: {
  live_class_id: number;
  objective_id: number;
  new_level: string;
}) => {
  return axios.get(BaseUrl + "english_quiz/start", {
    params: { ...params },
  });
};

export const handleUpdateNextQuestionEnglishQuiz = (params: {
  live_class_id: number;
  objective_id: number;
  new_level_id: number;
  english_live_practice_id: number;
}) => {
  return axios.get(BaseUrl + "english_quiz/next_question?", {
    params: { ...params },
  });
};

export const studentAnswerEnglishResponse = async (data: object) => {
  let config = {
    method: "post",
    url: `${BaseUrl}english_quiz/save_live_practice`,
    data: data,
  };
  return axios(config);
};

export const studentResultEnglishZone = async (params: object) => {
  return axios.get(BaseUrl + "english_quiz/result", {
    params: { ...params },
  });
};
