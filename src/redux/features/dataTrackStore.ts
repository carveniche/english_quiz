import { createSlice } from "@reduxjs/toolkit";

interface animationDetailsType {
  type: string;
  count: number;
}
interface dynamicKey {
  [key: string]: animationDetailsType;
}
interface StudentAnimation {
  identity: string;
  animationDetails: dynamicKey;
}

interface MessageStructure {
  identity: string;
  message: string;
}

interface dataTrackStore {
  students: StudentAnimation[];
  animationTrackIdentityAndType: {
    identity: string;
    type: string;
    count: number;
    isAnimationOn: boolean;
  };
  ShreenShareTracks: {
    identity: string;
    publishedState: boolean;
    toggleFrom?: string;
  };
  ChatMessages: MessageStructure[];
}

const initialState: dataTrackStore = {
  students: [],
  animationTrackIdentityAndType: {
    identity: "",
    type: "",
    count: 0,
    isAnimationOn: false,
  },
  ShreenShareTracks: {
    identity: "",
    publishedState: false,
    toggleFrom: "",
  },

  ChatMessages: [],
};

export const dataTrackStoreSlice = createSlice({
  name: "dataTrackStore",
  initialState,
  reducers: {
    addAnimationDatatrack: (state, action) => {
      const { type, identity } = action.payload;

      let obj = {
        identity: identity,
        type: type,
        count: state.animationTrackIdentityAndType.count + 1,
        isAnimationOn: true,
      };
      state.animationTrackIdentityAndType = obj;
      let { students } = state;
      let i = 0;
      let currentSelectedStudentIndex = -1;
      for (let item of students) {
        if (item.identity === identity) {
          currentSelectedStudentIndex = i;
          break;
        }
        i++;
      }
      if (currentSelectedStudentIndex == -1) {
        students.push({
          identity,
          animationDetails: {
            [type]: {
              type,
              count: 1,
            },
          },
        });
      } else {
        if (students[currentSelectedStudentIndex].animationDetails[type]?.count)
          students[currentSelectedStudentIndex].animationDetails[
            type
          ].count += 1;
        else {
          let { animationDetails } = students[currentSelectedStudentIndex];
          animationDetails = {
            ...animationDetails,
            [type]: { type, count: 1 },
          };
          students[currentSelectedStudentIndex].animationDetails =
            animationDetails;
        }
      }
    },
    disabledAnimation: (state, action) => {
      state.animationTrackIdentityAndType.isAnimationOn = action.payload;
    },

    addScreenShareDatatrack: (state, action) => {
      const { identity, publishedState, toggleFrom } = action.payload;
      let obj = {
        identity: identity,
        publishedState: publishedState || false,
        toggleFrom: toggleFrom || "",
      };
      state.ShreenShareTracks = obj;
    },

    addChatMessageDataTrack: (state, action) => {
      const { identity, message } = action.payload;

      let chatMessageObj = {
        identity: identity || "",
        message: message,
      };

      state.ChatMessages.push(chatMessageObj);
    },
  },
});

export const {
  addAnimationDatatrack,
  addScreenShareDatatrack,
  disabledAnimation,
  addChatMessageDataTrack,
} = dataTrackStoreSlice.actions;

export default dataTrackStoreSlice.reducer;
