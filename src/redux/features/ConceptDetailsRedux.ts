import { createSlice } from "@reduxjs/toolkit";
import { PREPOSTTESTKEY } from "../../constants";
export interface allConceptsDetails {
  status: Boolean;
  demo: Boolean;
  conceptDetails: object;
  mathzoneConceptDetails: object;
}
interface conceptDetails {
  allConceptsDetails: allConceptsDetails;
}

const initialState: conceptDetails = {
  allConceptsDetails: {
    status: false,
    demo: false,
    conceptDetails: [],
    mathzoneConceptDetails: [],
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
          let mathzoneDetails = [...concept_list];
          mathzoneDetails = mathzoneDetails.map(
            ({ today_class, id, name, tags }) => {
              let str = JSON.stringify(tags);
              let warmUp = str.includes("Warm Up");
              let wrapUp = str.includes("Wrap Up");
              let preTest = {
                tag_id: PREPOSTTESTKEY.preTest,
                name: "PreTest",
                levels: [],
              };

              let postTest = {
                tag_id: PREPOSTTESTKEY.postTest,
                name: "PostTest",
                levels: [],
              };
              if (!warmUp) tags = [preTest, ...tags];
              if (!wrapUp) tags = [...tags, postTest];
              return { today_class, id, name, tags: [...tags] };
            }
          );
          state.allConceptsDetails.mathzoneConceptDetails =
            mathzoneDetails || [];
        }
      }
    },
  },
});
export const { addToStore } = liveClassConceptDetails.actions;
export default liveClassConceptDetails.reducer;
