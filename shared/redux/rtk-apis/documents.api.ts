import { createApi } from "@reduxjs/toolkit/query/react";

import {
  TGetSummariesArg,
  TGetSummariesResponse,
  TUploadDocumentResponse,
  TJobStatusResponse,
  TTimelineItem,
} from "@/shared/typedefs/dashboard.types";

import { baseQuery } from "./baseQuery";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery,
  tagTypes: ["Documents"],
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
      providesTags: ["Documents"],
    }),
    uploadDocument: builder.mutation<TUploadDocumentResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "content/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    getJobStatus: builder.query<TJobStatusResponse, string>({
      query: (id) => ({
        url: `content/debug/job/${id}`,
      }),
    }),
    deleteDocument: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
    getDocumentTimeline: builder.query<{ items: TTimelineItem[]; total: number }, string>({
      query: (id) => ({
        url: `versions/${id}/timeline`,
      }),
    }),
  }),
});

export const {
  useGetSummariesQuery,
  useUploadDocumentMutation,
  useGetJobStatusQuery,
  useDeleteDocumentMutation,
  useGetDocumentTimelineQuery,
} = documentsApi;
