"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Processing your payment...");

  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (redirectStatus === "succeeded") {
      setMessage("✅ Payment successful! Thank you for your order.");
      dispatch(clearCart());
      router.push("/menu");
    } else if (redirectStatus === "failed") {
      setMessage("❌ Payment failed. Please try again.");
    } else if (paymentIntentId) {
      // Optionally fetch payment or order details from your backend here
      setMessage("✅ Payment received!");
    } else {
      setMessage("⚠️ No payment information found.");
    }
  }, [paymentIntentId, redirectStatus]);

  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
}
