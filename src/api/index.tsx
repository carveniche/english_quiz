import BaseUrl from "./ApiConfig.js";
import axios from "axios";

export const videoCallToken = async (user: Number, live_class_id: Number) => {
  return axios.get(BaseUrl + "app_students/video_call_token", {
    params: {
      user,
      live_class_id,
    },
  });
};

export const callTechSupport = async (
  user_id: Number,
  live_class_id: Number
) => {
  axios.get(BaseUrl + "app_students/create_tech_support", {
    params: {
      user_id,
      live_class_id,
    },
  });
};
export const getLessonAndMathZoneConceptDetails = (prop: {
  live_class_id: String;
}) => {
  return axios.get(BaseUrl + "app_students/concept_list", {
    params: {
      ...prop,
    },
  });
};
export const startPracticeMathzone = (params: {
  live_class_id: Number;
  sub_concept_id: Number;
  tag_id: Number;
  level: Number;
}) => {
  return axios.get(BaseUrl + "app_teachers/start_practice", {
    params: { ...params },
  });
};
export const handleUpdateNextQuestion = (params: {
  live_class_id: Number;
  sub_concept_id: Number;
  tag_id: Number;
  level: Number;
}) => {
  return axios.get(BaseUrl + "app_teachers/next_question", {
    params: { ...params },
  });
};

export const StudentResultMathZone = async (params: Object) => {
  return axios.get(BaseUrl + "app_teachers/result", {
    params: { ...params },
  });
};
export const getReviewResultData = async (params: Object) => {
  return axios(BaseUrl + "app_teachers/review_result", {
    params: { ...params },
  });
};

export const viewQuestionStatusApi = async (practiceId: Number) => {
  return axios(
    `${BaseUrl}app_teachers/view_questions?live_class_practice_id=${practiceId}`
  );
};

export const StudentAnswerResponse = async (params: String, data: Object) => {
  let config = {
    method: "post",
    url: `${BaseUrl}app_teachers/save_practice${params}`,
    data: data,
  };
  return axios(config);
};

export const getFlagQuestionConceptList = (liveClassID: String) => {
  return axios(
    `${BaseUrl}app_teachers/flagged_concepts?live_class_id=${liveClassID}`
  );
};
export const markAsResolvedFlagQuestion = (
  flagQuestionId: string,
  userId: string
) => {
  return axios(
    `${BaseUrl}app_teachers/mark_as_resolved/?flagged_question_id=${flagQuestionId}&user_id=${userId}`
  );
};

export const fetchFlagQuestion = (
  conceptId: string,
  liveClassID: string,
  tagId: string
) => {
  return axios(
    `${BaseUrl}app_teachers/flagged_questions?sub_concept_id=${conceptId}&tag_id=${tagId}&live_class_id=${liveClassID}`
  );
};
export const getStudentSHomeWorkDetail = (liveClassId: string) => {
  return axios.get(
    `${BaseUrl}app_teachers/view_homeworks?live_class_id=${liveClassId}`
  );
};
export const getStudentSHomeWorkIncorrectQuestionDate = (
  liveClassID: string,
  tagQuizId: string,
  homeWorkId: string
) => {
  //44308 48062

  return axios(
    `${BaseUrl}app_teachers/homework_review?live_class_id=${liveClassID}&tag_quiz_id=${tagQuizId}&homework_id=${homeWorkId}`
  );
};
export const markAsResolvedHomeWorkQuestion = (
  question_id: string,
  userId: string,
  liveClassID: string,
  homework_id: string
) => {
  return axios(`${BaseUrl}app_teachers/mark_as_homework_question_resolved?question_id=${question_id}&user_id=${userId}&live_class_id=${liveClassID}&homework_id=${homework_id}
  `);
};

export const startSpeedMathGame = async (
  level_id: any,
  live_class_id: number,
  play_with: string
) =>
  axios.get(BaseUrl + "app_students/start_game", {
    params: {
      level_id,
      live_class_id,
      play_with,
    },
  });

export const storeGameResponse = async (
  player_id: number,
  game_id: number,
  question_id: number,
  correct: boolean,
  answer: any
) =>
  axios.get(BaseUrl + "app_students/store_game_response", {
    params: {
      player_id,
      game_id,
      question_id,
      correct,
      answer,
    },
  });

export const createSpeedMathGame = async (game_id: number, player_id: number) =>
  axios.get(BaseUrl + "app_students/create_game_players", {
    params: {
      game_id,
      player_id,
    },
  });
