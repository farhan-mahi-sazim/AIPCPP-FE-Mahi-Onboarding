import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authenticatedUserSliceReducer from "./reducers/user.reducer";
import { documentsApi } from "./rtk-apis/documents.api";

export const store = configureStore({
  reducer: {
    authenticatedUser: authenticatedUserSliceReducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(documentsApi.middleware),
});

setupListeners(store.dispatch);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

