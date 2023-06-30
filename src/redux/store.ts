import { configureStore } from "@reduxjs/toolkit";

import reservationsReducer from "./features/reservationSlice";
import liveClassDetailsReducer from "./features/liveClassDetails";

export const store = configureStore({
  reducer: {
    reservations: reservationsReducer,
    liveClassDetails: liveClassDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
