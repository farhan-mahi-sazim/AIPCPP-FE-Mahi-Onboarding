import { TGetSummariesArg, TGetSummariesResponse } from "@/shared/typedefs/dashboard.types";

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery,
  endpoints: (builder) => ({
    getSummaries: builder.query<TGetSummariesResponse, TGetSummariesArg>({
      query: ({ limit = 10, offset = 0, search }) => ({
        url: "content/summaries",
        params: {
          limit,
          offset,
          ...(search ? { search } : {}),
        },
      }),
    }),
  }),
});

export const { useGetSummariesQuery } = documentsApi;
