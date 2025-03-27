import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = "http://localhost:8000/api/v1/";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (courseId) => ({
        url: "/cart",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (courseId) => ({
        url: `/cart/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Cart'],
    }),
    createCheckoutSession: builder.mutation({
      query: () => ({
        url: "/create-checkout-session",
        method: "POST",
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useCreateCheckoutSessionMutation,
} = cartApi;