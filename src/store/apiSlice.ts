// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "./authSlice";
import type {
  MenuItem,
  User,
  Order,
  PaymentIntentRequest,
  PaymentIntentResponse,
} from "@/types";
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

// apiSlice.ts (update the reauth logic)
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    try {
      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };
        api.dispatch(setCredentials({ accessToken }));
        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        //api.dispatch(logOut());
      }
    } catch (error) {
      //api.dispatch(logOut());
    }
  }

  return result;
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Menu", "User", "Order"], // Added User
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
      { email: string; password: string; staySignedIn: boolean }
    >({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    createAccount: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/user",
        method: "POST",
        body: newUser,
      }),
    }),
    getCustomerInfo: builder.query<Partial<User>, void>({
      query: () => "/user",
    }),
    getRecentOrders: builder.query<Order[], void>({
      query: () => "/orders",
    }),
    getPaymentIntent: builder.mutation<
      PaymentIntentResponse,
      PaymentIntentRequest
    >({
      query: (body) => ({
        url: "/create-payment-intent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMenuQuery,
  useAddMenuItemMutation,
  useSignInMutation,
  useCreateAccountMutation,
  useGetCustomerInfoQuery,
  useGetRecentOrdersQuery,
  useGetPaymentIntentMutation,
} = apiSlice;
