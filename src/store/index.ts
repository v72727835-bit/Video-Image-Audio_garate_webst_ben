import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import studioReducer from "./slices/studioSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      studio: studioReducer,
    },
    middleware: (getDefault) => getDefault({ serializableCheck: false }),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
