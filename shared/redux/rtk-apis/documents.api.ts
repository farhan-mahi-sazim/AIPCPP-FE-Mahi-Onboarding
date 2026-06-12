import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IGetSummariesArg,
  IGetSummariesResponse,
  IUploadDocumentResponse,
  IJobStatusResponse,
  IVectorSearchArg,
  IVectorSearchResponse,
} from "@/modules/dashboard/dashboard.types";
import { ITimelineItem } from "@/shared/typedefs/common.types";

import { baseQuery } from "./baseQuery";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery,
  tagTypes: ["Documents"],
  endpoints: (builder) => ({
    getSummaries: builder.query<IGetSummariesResponse, IGetSummariesArg>({
      query: ({ limit = 10, offset = 0, search, file_type, sort_order }) => ({
        url: "content/summaries",
        params: {
          limit,
          offset,
          ...(search ? { search } : {}),
          ...(file_type ? { file_type } : {}),
          ...(sort_order ? { sort_order } : {}),
        },
      }),
      providesTags: ["Documents"],
    }),
    uploadDocument: builder.mutation<IUploadDocumentResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "content/upload",
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(documentsApi.util.invalidateTags(["Documents"]));
        } catch {
          // Upload failed, no invalidation needed
        }
      },
    }),
    getJobStatus: builder.query<IJobStatusResponse, string>({
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
    getDocumentTimeline: builder.query<{ items: ITimelineItem[]; total: number }, string>({
      query: (id) => ({
        url: `versions/${id}/timeline`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),
    vectorSearch: builder.query<IVectorSearchResponse, IVectorSearchArg>({
      query: (body) => ({
        url: "search",
        method: "POST",
        body,
      }),
    }),
    createVersionOverride: builder.mutation<
      ITimelineItem,
      { documentId: string; data: Partial<ITimelineItem["data"]> }
    >({
      query: ({ documentId, data }) => ({
        url: `versions/${documentId}/override`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: "Documents", id: documentId },
        "Documents",
      ],
    }),
    updateHumanVersion: builder.mutation<
      ITimelineItem,
      { versionId: string; documentId: string; data: Partial<ITimelineItem["data"]> }
    >({
      query: ({ versionId, data }) => ({
        url: `versions/version/${versionId}`,
        method: "PATCH",
        body: { data },
      }),
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: "Documents", id: documentId },
        "Documents",
      ],
    }),
    deleteVersion: builder.mutation<{ message: string }, { versionId: string; documentId: string }>(
      {
        query: ({ versionId }) => ({
          url: `versions/version/${versionId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { documentId }) => [
          { type: "Documents", id: documentId },
          "Documents",
        ],
      },
    ),
  }),
});

export const {
  useGetSummariesQuery,
  useUploadDocumentMutation,
  useGetJobStatusQuery,
  useDeleteDocumentMutation,
  useGetDocumentTimelineQuery,
  useVectorSearchQuery,
  useCreateVersionOverrideMutation,
  useUpdateHumanVersionMutation,
  useDeleteVersionMutation,
} = documentsApi;
