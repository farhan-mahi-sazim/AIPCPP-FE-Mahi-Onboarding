import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/shared/env.constants";

export const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1/",

  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token")?.replace(/"/g, "");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
    return headers;
  },
});

export const baseQueryWithErrorHandling = baseQuery;
