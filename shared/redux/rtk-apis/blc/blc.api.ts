import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blcApi = createApi({
  reducerPath: "blcApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: () => ({}),
});

export default blcApi;
