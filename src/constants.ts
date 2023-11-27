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
  lesson: "/lesson",
  mathzone: "/mathzone",
  whiteboard: {
    key: "whiteboard",
    path: "/whiteboard",
  },
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
      uploadResources: {
        keys: "/uploadResources",
        route: "/uploadResources",
      },
    },
  },
};
export const MATHZONEDATAKEY = {
  mathzoneQuestionData: "mathzoneQuestionData",
  mathzoneWhiteBoardData: "mathzoneWhiteBoardData",
  openClosedWhiteBoard: "openClosedWhiteBoard",
  viewIncorrectQuestion:"viewIncorrectQuestion"
};

export const MAINWHITEBOARD = {
  mainWhiteBoardData: "mainWhiteBoardData",
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
  viewIncorrectQuestion:"viewIncorrectQuestion"
};
export const CICO = {
  path: "/cico",
  key: "cico",
  checkIn: "checkIn",
  checkOut: "checkOut",
};

export const WHITEBOARDSTANDARDSCREENSIZE = {
  width: 1500,
  height: 500,
};
export const MENUBARHEIGHT = 60;
export const LESSON = {
  LessonDataTrack: "LessonDataTrack",
  LessonIndexChange: "LessonIndexChange",
  lessonWhiteBoardData: "lessonWhiteBoardData",
};
export const WHITEBOARD = {
  whiteBoardData: "whiteBoardData",
  pdfIndex: "pdfIndex",
  openGraph: "openGraph",
};
export const SCRATCHLESSON = {
  scratchWhiteBoardData: "scratchWhiteBoardData",
};
export const MISCELLANEOUS = {
  miscellaneousDataWhiteBoard: "miscellaneousDataWhiteBoard",
};

export const SHAPECHALLENGE = {
  shapeChallengeCheckInWhiteBoard: "shapeChallengeCheckInWhiteBoard",
  shapeChallengeCheckOutWhiteBoard: "shapeChallengeCheckOutWhiteBoard",
};

export const UPLOADRESOURCE = {
  uploadResourceWhiteboardData: "uploadResourceWhiteboardData",
  closeUploadResource: "closeUploadResource",
};
export const GGB = {
  type: "ggb",
  dataTrackName: "ggbDataTrack",
  ggbChangeMode: "ggbChangeMode",
  key: "geogebra",
  path: "/geogebra",
  name: "Simulation",
  icon: "/menu-icon/MathLessons.svg",
};

export const IFRAMENEWCODING = {
  path: "/iframeCoding",
  key: "iframeCoding",
  name: "CodingNew",
  icon: "/menu-icon/CodingIcon.svg",
};

export const SCREENRECORDING = true;
export const SHOWFLOATINGPARTICIPANT = true;
