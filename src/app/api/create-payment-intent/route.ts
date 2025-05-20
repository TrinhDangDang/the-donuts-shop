// /app/api/create-payment-intent/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { CartItem } from "@/types";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import MenuItem from "@/models/MenuItem";
import type { MenuItem as MenuItemType } from "@/types";

// Initialize Stripe with proper typing
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil", // Updated to current stable version
  typescript: true,
});

type PaymentIntentRequest = {
  cart: CartItem[];
  metadata?: Record<string, string>;
  email?: string;
  shipping?: {
    name: string;
    address: {
      line1: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
};

export async function POST(req: Request) {
  // Verify content type
  const contentType = (await headers()).get("content-type");
  if (contentType !== "application/json") {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 415 }
    );
  }

  // Authentication
  const authHeader = req.headers.get("Authorization");

  const token = authHeader?.split(" ")[1];
  let decoded: { userId: string; userRole: string } | null = null;

  try {
    if (!process.env.ACCESS_SECRET) {
      throw new Error("ACCESS_SECRET is not defined");
    }
    if (token) {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET) as {
        userId: string;
        userRole: string;
      };
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Token expired or invalid" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as PaymentIntentRequest;
    const cartItems = body.cart;

    // Validate cart
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    await dbConnect();

    let subtotal = 0;
    // Validate each cart item and calculate total
    for (const item of cartItems) {
      if (!item.menuItemId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid cart item format" },
          { status: 400 }
        );
      }

      const menuItem = await MenuItem.findById(
        item.menuItemId
      ).lean<MenuItemType>();
      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 404 }
        );
      }

      if (menuItem.stock.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${menuItem.title}` },
          { status: 400 }
        );
      }

      subtotal += item.quantity * menuItem.price;
    }

    const tax = subtotal * 0.0825; // 8.25% tax
    const amount = Math.round((subtotal + tax) * 100); // Convert to cents

    if (amount < 50) {
      // Minimum $0.50
      return NextResponse.json(
        { error: "Amount must be at least $0.50" },
        { status: 400 }
      );
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            priceAtOrder: item.price,
            title: item.name,
          }))
        ),
        subtotal: amount.toString(),
        userId: decoded ? decoded.userId : "guest",
        email: body.email || null,
        shippping: body.shipping
          ? JSON.stringify({
              name: body.shipping.name,
              address: {
                line1: body.shipping.address.line1,
                city: body.shipping.address.city || undefined,
                state: body.shipping.address.state || undefined,
                postal_code: body.shipping.address.postal_code || undefined,
                country: body.shipping.address.country || undefined,
              },
            })
          : null,
      },
      receipt_email: body.email || undefined,
      shipping: body.shipping
        ? {
            name: body.shipping.name,
            address: {
              line1: body.shipping.address.line1,
              city: body.shipping.address.city || undefined,
              state: body.shipping.address.state || undefined,
              postal_code: body.shipping.address.postal_code || undefined,
              country: body.shipping.address.country || undefined,
            },
          }
        : undefined,
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret, amount: amount / 100 },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err) {
    console.error("Payment intent error:", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          type: err.type,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
