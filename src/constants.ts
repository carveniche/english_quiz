export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints["video"] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = "TwilioVideoApp-selectedAudioInput";
export const SELECTED_AUDIO_OUTPUT_KEY = "TwilioVideoApp-selectedAudioOutput";
export const SELECTED_VIDEO_INPUT_KEY = "TwilioVideoApp-selectedVideoInput";

// This is used to store the current background settings in localStorage
export const SELECTED_BACKGROUND_SETTINGS_KEY =
  "TwilioVideoApp-selectedBackgroundSettings";

export const GALLERY_VIEW_ASPECT_RATIO = 9 / 16; // 16:9
export const GALLERY_VIEW_MARGIN = 3;
export const MAXIMUMACTIVETAB = 4;
export const ROUTERKEYCONST = {
  allScreen: "/allscreen",
  myScreen: "/myscreen",
  mathvideolesson: "/mathvideolesson",
  speedmath: "/speedmath",
  coding: "/coding",
  whiteboard: "/whiteboard",
  lesson: "/lesson",
  mathzone: "/mathzone",
  miscellaneous: {
    key: "miscellaneous",
    subRoute: {
      homework: {
        keys: "/homework",
        route: "/homework",
      },
      flagQuestion: {
        keys: "/flagQuestion",
        route: "/flagQuestion",
      },
    },
  },
};
export const MATHZONEDATAKEY = {
  mathzoneQuestionData: "mathzoneQuestionData",
};
export const FLAGGEDQUESTIONKEY = {
  flaggedQuestionMenu: "flaggedQuestionMenu",
};
export const HOMEWORKQUESTIONKEY = {
  homeWorkQuestionDataTrack: "homeWorkQuestionDataTrack",
};

export const PREPOSTTESTKEY = {
  preTest: "pre_test",
  postTest: "post_test",
};
export const CICO = {
  path: "/cico",
  key: "cico",
  checkIn: "checkIn",
  checkOut: "checkOut",
};

export const MENUBARHEIGHT = 60;
