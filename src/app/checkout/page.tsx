"use client";

import { useState } from "react";
import { useGetPaymentIntentMutation } from "@/store/apiSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { clearCart, selectCurrentCart } from "@/store/cartSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [getPaymentIntent, { isLoading }] = useGetPaymentIntentMutation();
  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const currentCartItems = useSelector(selectCurrentCart);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await getPaymentIntent({
        cart: currentCartItems,
        email: formData.email,
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: {
            line1: formData.line1,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
        },
      }).unwrap();
      setTotalAmount(res.amount);
      setClientSecret(res.clientSecret);
    } catch (err) {
      console.error("Failed to create PaymentIntent:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {!clientSecret ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
          <input
            name="line1"
            placeholder="Street Address"
            value={formData.line1}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            value={formData.postal_code}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country (e.g., US)"
            value={formData.country}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Continue to Payment
          </button>
        </form>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm totalAmount={totalAmount} />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm({ totalAmount }: { totalAmount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      setMessage("✅ Payment succeeded!");
      dispatch(clearCart());
    }
  };

  return (
    <div>
      <h1>Total: {totalAmount}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Pay
        </button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
}
