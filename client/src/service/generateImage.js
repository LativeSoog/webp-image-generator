import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const DATA_TAG = { type: "Generate", id: "LIST" };

export const generateApi = createApi({
  reducerPath: "generateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (build) => ({
    generateImage: build.mutation({
      query: ({ prompt, width, height, style }) => ({
        url: "/generate-image",
        method: "POST",
        body: JSON.stringify({ prompt, width, height, style }),
        headers: {
          "content-type": "application/json",
        },
      }),
      providesTags: (result = []) => [DATA_TAG],
    }),

    saveImage: build.mutation(),
  }),
});

export const { useGenerateImageMutation } = generateApi;
