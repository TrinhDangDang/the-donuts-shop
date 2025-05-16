"use client";
import { useCreateAccountMutation } from "@/store/apiSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAccountPage() {
  const router = useRouter();
  const [createAccount, { isLoading, error }] = useCreateAccountMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount({
        userName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Show success message and redirect to login
      setSuccessMessage(
        "Account created! Please check your email to verify your account."
      );
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err) {
      console.error("Failed to create account:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-6 shadow-lg rounded-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>

        {successMessage ? (
          <div className="bg-green-100 text-green-700 p-4 rounded">
            {successMessage}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 rounded"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {"data" in error
                  ? (error.data as { error?: string })?.error ||
                    "An error occurred"
                  : "An error occurred"}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mt-4"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
