"use client";
import { useSignInMutation } from "@/store/apiSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading, error }] = useSignInMutation();
  const [userInfo, setUserInfo] = useState({
    email: "", // Changed from username to email for clarity
    password: "", // Changed from pw to password for clarity
    staySignedIn: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, checked, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call the signIn mutation
      const response = await signIn({
        email: userInfo.email,
        password: userInfo.password,
        staySignedIn: userInfo.staySignedIn,
      }).unwrap();

      // Update Redux store with the token
      dispatch(setCredentials({ accessToken: response.accessToken }));

      // Redirect to home or previous page
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      // Error handling is already done by RTK Query
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        className="flex flex-col gap-4 p-4 w-full max-w-md shadow-md bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h1>

        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {"data" in error
              ? (error.data as { error?: string })?.error || "Login failed"
              : "Login failed"}
          </div>
        )}

        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={userInfo.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={userInfo.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="staySignedIn"
            checked={userInfo.staySignedIn}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="staySignedIn"
            className="ml-2 block text-sm text-gray-700"
          >
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/create-account"
            className="text-blue-600 hover:text-blue-500"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
