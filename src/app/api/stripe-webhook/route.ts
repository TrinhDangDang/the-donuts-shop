// app/api/stripe-webhook/route.ts
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;
      const cartItems = JSON.parse(metadata.cartItems);
      const isGuest = !metadata.userId || metadata.userId === "guest";
      const shipping = metadata.shipping ? JSON.parse(metadata.shipping) : null;
      const subtotal = Number(metadata.subtotal);
      const address = Object.values(shipping.address).join(",");

      // Update your database
      await dbConnect();
      try {
        const newOrder = await Order.create({
          ...(isGuest
            ? {
                guestName: shipping.name,
                guestEmail: metadata.email,
                guestAddress: address,
              }
            : {
                userId: metadata.userId,
              }),
          menuItems: cartItems.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
          })),
          status: "pending",
          paymentStatus: "paid",
          totalAmount: subtotal,
        });
        console.log("✅ Order created:", newOrder);
      } catch (err) {
        console.error("❌ Order creation failed:", err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
