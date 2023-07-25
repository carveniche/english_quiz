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
}

const initialState: dataTrackStore = {
  students: [],
};

export const dataTrackStoreSlice = createSlice({
  name: "dataTrackStore",
  initialState,
  reducers: {
    addDataTrackValue: (state, action) => {
      const { type, identity } = action.payload;
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
  },
});

export const { addDataTrackValue } = dataTrackStoreSlice.actions;

export default dataTrackStoreSlice.reducer;
