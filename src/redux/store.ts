import { configureStore } from "@reduxjs/toolkit";
import activeTabReducer from "./features/addActiveTabLink";

import liveClassDetailsReducer from "./features/liveClassDetails";
import videoCallTokenDataReducer from "./features/videoCallTokenData";

import dataTrackStore from "./features/dataTrackStore";
import liveClassConceptDetails from "./features/ConceptDetailsRedux";
import ComponentLevelDataReducer from "./features/ComponentLevelDataReducer";

export const store = configureStore({
  reducer: {
    liveClassDetails: liveClassDetailsReducer,
    videoCallTokenData: videoCallTokenDataReducer,
    activeTabReducer: activeTabReducer,
    dataTrackStore: dataTrackStore,
    liveClassConceptDetails:liveClassConceptDetails,
    ComponentLevelDataReducer:ComponentLevelDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
