import { configureStore } from "@reduxjs/toolkit";
import activeTabReducer from "./features/addActiveTabLink";

import liveClassDetailsReducer from "./features/liveClassDetails";
import videoCallTokenDataReducer from "./features/videoCallTokenData";

import dataTrackStore from "./features/dataTrackStore";

export const store = configureStore({
  reducer: {
    liveClassDetails: liveClassDetailsReducer,
    videoCallTokenData: videoCallTokenDataReducer,
    activeTabReducer: activeTabReducer,
    dataTrackStore: dataTrackStore,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
