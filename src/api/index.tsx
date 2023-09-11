import BaseUrl from "./ApiConfig.js";
import axios from "axios";
export const baseURL2 = BaseUrl;
export const baseURL = BaseUrl;
export const imageUrl = "https://www.begalileo.com";
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

export const getGameResult = async (
  game_id: number,
  live_class_id: number,
  player_id: number,
  computer_score: number
) =>
  axios.get(BaseUrl + "app_students/game_result", {
    params: {
      game_id,
      live_class_id,
      player_id,
      computer_score,
    },
  });
export const startPrePostTest = (params: object) => {
  return axios(BaseUrl + "app_teachers/start_pre_post_test", {
    params: { ...params },
  });
};
export const reviewPrePostTestResult = (params: object) => {
  return axios(BaseUrl + "app_teachers/review_pre_post_test_result", {
    params,
  });
};
export const viewPrePostTestQuestionResponse = (params: object) => {
  return axios(BaseUrl + "app_teachers/view_questions", {
    params,
  });
};

export const saveStudentPrePostTestResponse = async (
  params: String,
  data: Object
) => {
  let config = {
    method: "post",
    url: `${BaseUrl}app_teachers/save_pre_post_test${params}`,
    data: data,
  };
  return axios(config);
};

export const handleUpdateNextPrePostQuestion = (params: {
  live_class_id: Number;
  sub_concept_id: Number;
  tag_id: Number;
  level: Number;
}) => {
  return axios.get(
    BaseUrl + "app_teachers/skip_pre_post_test?pre_post_test_id",
    {
      params: { ...params },
    }
  );
};

export const fetchCheckInData = (student_id: String, live_class_id: String) => {
  return axios.get(
    `${BaseUrl}live_class_checkinout_activities/checkin_activity`,
    {
      params: {
        student_id,
        live_class_id,
      },
    }
  );
};

export const fetchCheckOutData = (
  student_id: String,
  live_class_id: String
) => {
  return axios.get(
    `${BaseUrl}live_class_checkinout_activities/checkout_activity`,
    {
      params: {
        student_id,
        live_class_id,
      },
    }
  );
};

export const getStudentActivityResponse = (
  student_id: string,
  live_class_id: string
) => {
  return axios.get(
    `${BaseUrl}live_class_checkinout_activities/checkin_out_activity_responses`,
    {
      params: {
        student_id,
        live_class_id,
      },
    }
  );
};

export const studentCheckInGetData = (
  student_id: string,
  live_class_id: string
) => {
  return axios.get(
    `${BaseUrl}live_class_checkinout_activities/checkin_activity`,
    {
      params: {
        student_id,
        live_class_id,
      },
    }
  );
};

export const studentCheckOutGetData = (obj: object) => {
  return axios.get(
    `${BaseUrl}live_class_checkinout_activities/checkout_activity`,
    {
      params: obj,
    }
  );
};

export const StudentActivityResponseSave = (body: any) => {
  const config = {
    method: "post",
    url: baseURL2 + "live_class_checkinout_activities/store_student_response",
    data: body,
  };
  return axios(config);
};
export const StudentActivityTeacherResponseSave = (body: object) => {
  const config = {
    method: "post",
    url: baseURL2 + "live_class_checkinout_activities/store_teacher_response",
    data: body,
  };
  return axios(config);
};

export const updateStatusofCicoActivity = (
  liveClassID: string,
  activityId: string,
  duration: string
) => {
  return axios(
    `${baseURL2}live_class_checkinout_activities/update_status?live_class_id=${liveClassID}&checkin_ativity_id=${activityId}&duration=${duration}`
  );
};
export const recordingUpdateToServer = async (
  live_class_id: string,
  recording_links: string,
  recording_id: string
) =>
  axios.get(baseURL + "app_students/check_recording_api", {
    params: {
      live_class_id,
      recording_links,
      recording_id,
    },
  });

export const doCreateLiveClassRecordings = async (
  live_class_id: string,
  upload_id: string,
  file_key: string
) =>
  axios.get(baseURL + "app_students/create_live_class_recording", {
    params: {
      live_class_id,
      upload_id,
      file_key,
    },
  });

export const doPartUploadingStatus = async (
  recording_id: string,
  part: string,
  etag: string
) => {
  return axios.get(baseURL + "app_students/create_recording_parts", {
    params: {
      recording_id,
      part,
      etag,
    },
  });
};

export const recordingFailedError = (body: object) => {
  let url = baseURL + "app_students/create_recording_error_logs";
  return axios.post(url, body);
};

export const getAllRecordingUploadId = async (live_class_id: string) =>
  axios.get(baseURL + "app_students/get_live_class_recording_details", {
    params: {
      live_class_id,
    },
  });
export const checkRecordingStatus = async (live_class_id: string) =>
  axios.get(baseURL + "app_students/show_recording_status", {
    params: {
      live_class_id,
    },
  });

export const submitErrorLog = async (
  user_id: string,
  live_class_id: string,
  message: string,
  error_code: string,
  network_quality: string
) =>
  axios
    .get(baseURL + "app_students/create_error_log", {
      params: {
        user_id,
        live_class_id,
        message,
        error_code,
        network_quality,
      },
    })
    .catch((error: any) => {
      if (error.response) {
        console.log(error.response.data, "h1");
      } else if (error.request) {
        console.log(error.request, "h2");
      } else {
        console.log("Error", error.message, "h3");
      }
    });

export const getThunkableLinks = async (live_class_id: number) =>
  axios.get(baseURL + "app_students/generate_thunkable_link", {
    params: {
      live_class_id,
    },
  });

export const storeCodingLogNewCurriculam = async (
  live_class_id: number,
  coding_learning_outcome_id: number
) =>
  axios
    .get(baseURL + "app_students/live_class_video_lesson_logs", {
      params: {
        live_class_id,
        coding_learning_outcome_id,
      },
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data, "h1");
      } else if (error.request) {
        console.log(error.request, "h2");
      } else {
        console.log("Error", error.message, "h3");
      }
    });

export const showScratchTeacher = async (
  live_class_id: number,
  user_id: number
) =>
  axios.get(baseURL + "app_students/codings", {
    params: {
      live_class_id,
      user_id,
    },
  });
