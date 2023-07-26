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

interface dataTrackStore {
  students: StudentAnimation[];
  animationTrackIdentityAndType: {
    identity: string;
    type: string;
    count: number;
  };
  ShreenShareTracks: {
    identity: string;
    publishedState: boolean;
  };
}

const initialState: dataTrackStore = {
  students: [],
  animationTrackIdentityAndType: {
    identity: "",
    type: "",
    count: 0,
  },
  ShreenShareTracks: {
    identity: "",
    publishedState: false,
  },
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

    addScreenShareDatatrack: (state, action) => {
      const { identity, publishedState } = action.payload;
      let obj = {
        identity: identity,
        publishedState: publishedState,
      };
      state.ShreenShareTracks = obj;
    },
  },
});

export const { addAnimationDatatrack, addScreenShareDatatrack } =
  dataTrackStoreSlice.actions;

export default dataTrackStoreSlice.reducer;
