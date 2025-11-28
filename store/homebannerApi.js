import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Button Data **/
export const btnData = [
  {
    id: 1,
    label: "Active",
    value: "active",
  },
  {
    id: 2,
    label: "Inactive",
    value: "inactive",
  },
];

/** Home Banner API **/
export const homeBannerApi = createApi({
  reducerPath: "homeBannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ifmdb.vercel.app/v1/api",
  }),
  tagTypes: ["homeBanner"],
  endpoints: (builder) => ({
    /** Get all banners */
    getHomeBanner: builder.query({
      query: () => "/banners",
      transformResponse: (response) =>
        Array.isArray(response.data) ? response.data : [response.data],
      providesTags: ["homeBanner"],
    }),
  }),
});

export const { useGetHomeBannerQuery } = homeBannerApi;
