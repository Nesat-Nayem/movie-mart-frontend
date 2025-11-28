import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const becomeVendorApi = createApi({
  reducerPath: "becomeVendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/v1/api",
  }),
  tagTypes: ["becomeVendorApi"],
  endpoints: (builder) => ({
    createAdvertise: builder.mutation({
      query: (formData) => ({
        url: "/vendors/applications",
        method: "POST",
        body: formData,
      }),
      // remove transformResponse completely
      invalidatesTags: ["becomeVendorApi"],
    }),
  }),
});

export const { useCreateAdvertiseMutation } = becomeVendorApi;
