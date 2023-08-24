import { createSlice } from "@reduxjs/toolkit";
export interface allConceptsDetails {
  status: Boolean;
  demo: Boolean;
  conceptDetails: [];
}
interface conceptDetails {
  allConceptsDetails: allConceptsDetails;
}

const initialState: conceptDetails = {
  allConceptsDetails: {
    status: false,
    demo: false,
    conceptDetails: [],
  },
};
const liveClassConceptDetails = createSlice({
  name: "LiveClassConceptDeails",
  initialState,
  reducers: {
    addToStore: (state, action) => {
      const { payload } = action;
      if (payload.status) {
        const { concept_list } = payload;
        if (concept_list.length) {
          state.allConceptsDetails.conceptDetails = concept_list || [];
          state.allConceptsDetails.status = true;
        }
      }
    },
  },
});
export const { addToStore } = liveClassConceptDetails.actions;
export default liveClassConceptDetails.reducer;
