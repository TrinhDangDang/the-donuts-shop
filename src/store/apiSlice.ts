// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "./authSlice";
import type { MenuItem } from "@/types";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data && (refreshResult.data as any).accessToken) {
      api.dispatch(
        setCredentials({ accessToken: (refreshResult.data as any).accessToken })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        (refreshResult.error.data as any).message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Menu"],
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
    signIn: builder.mutation<
      { accessToken: string },
      { email: string; pw: string }
    >({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useGetMenuQuery, useAddMenuItemMutation } = apiSlice;
