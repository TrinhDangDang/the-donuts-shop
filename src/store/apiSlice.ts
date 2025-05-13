import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MenuItem } from "@/types";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Menu"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getMenu: builder.query<MenuItem[], void>({
      query: () => "/menu",
      providesTags: ["Menu"],
    }),

    addMenuItem: builder.mutation<MenuItem, Partial<MenuItem>>({
      query: (newItem) => ({
        url: "/menu",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const { useGetMenuQuery, useAddMenuItemMutation } = apiSlice;
