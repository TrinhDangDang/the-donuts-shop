"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Processing your payment...");

  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  useEffect(() => {
    if (redirectStatus === "succeeded") {
      setMessage("✅ Payment successful! Thank you for your order.");
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
