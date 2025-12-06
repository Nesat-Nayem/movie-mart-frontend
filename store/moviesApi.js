import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.moviemart.org/v1/api";

/** Movies API **/
export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["Movies"],
  endpoints: (builder) => ({
    /** Get all movies */
    getMovies: builder.query({
      query: () => "/movies",
      transformResponse: (response) =>
        Array.isArray(response.data) ? response.data : [response.data],
      providesTags: ["Movies"],
    }),

    /** Get single movie by ID */
    getMovieById: builder.query({
      query: (id) => `/movies/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Movies", id }],
    }),

    /** Get movie reviews */
    getMovieReviews: builder.query({
      query: ({ id, page = 1, limit = 10 }) => 
        `/movies/${id}/reviews?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        reviews: response.data,
        meta: response.meta,
      }),
      providesTags: (result, error, { id }) => [{ type: "Movies", id: `reviews-${id}` }],
    }),

    /** Get upcoming movies */
    getUpcomingMovies: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => 
        `/movies/upcoming?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        movies: response.data,
        meta: response.meta,
      }),
      providesTags: ["Movies"],
    }),

    /** Get top rated movies */
    getTopRatedMovies: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => 
        `/movies/top-rated?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        movies: response.data,
        meta: response.meta,
      }),
      providesTags: ["Movies"],
    }),

    /** Get movies by genre */
    getMoviesByGenre: builder.query({
      query: ({ genre, page = 1, limit = 10 }) => 
        `/movies/genre/${genre}?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        movies: response.data,
        meta: response.meta,
      }),
      providesTags: ["Movies"],
    }),
  }),
});

export const { 
  useGetMoviesQuery, 
  useGetMovieByIdQuery,
  useGetMovieReviewsQuery,
  useGetUpcomingMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetMoviesByGenreQuery,
} = moviesApi;
