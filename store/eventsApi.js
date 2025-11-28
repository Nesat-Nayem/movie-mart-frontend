import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Home Banner API **/
export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/v1/api",
  }),
  tagTypes: ["eventsApi"],
  endpoints: (builder) => ({
    /** Get all banners */
    getEvents: builder.query({
      query: () => "/events",
      transformResponse: (response) =>
        Array.isArray(response.data) ? response.data : [response.data],
      providesTags: ["eventsApi"],
    }),
  }),
});

export const { useGetEventsQuery } = eventsApi;
