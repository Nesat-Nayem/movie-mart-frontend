import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Home Banner API **/
export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ifmdb.atpuae.com/v1/api",
  }),
  tagTypes: ["moviesApi"],
  endpoints: (builder) => ({
    /** Get all banners */
    getMovies: builder.query({
      query: () => "/movies",
      transformResponse: (response) =>
        Array.isArray(response.data) ? response.data : [response.data],
      providesTags: ["moviesApi"],
    }),
  }),
});

export const { useGetMoviesQuery } = moviesApi;
