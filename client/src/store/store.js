import { configureStore } from "@reduxjs/toolkit";
import { generateApi } from "../service/generateImage";

export const store = configureStore({
  reducer: {
    [generateApi.reducerPath]: generateApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(generateApi.middleware),
});
