// app/api/stripe-webhook/route.ts
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import User from "@/models/User";
import Stripe from "stripe";
import MenuItem from "@/models/MenuItem";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import transporter from "@/lib/emailUtil";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { orderId } = paymentIntent.metadata;

      if (!orderId) {
        console.error("Missing orderId in metadata");
        return NextResponse.json(
          { error: "Missing orderId in metadata" },
          { status: 400 }
        );
      }

      await dbConnect();

      // Start a transaction for atomic updates
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // 1. Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { paymentStatus: "paid", status: "processing" },
          { new: true, session }
        );

        if (!updatedOrder) {
          throw new Error(`Order ${orderId} not found`);
        }
        const emailContent = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, ${
          updatedOrder.guestName || "Valued Customer"
        }!</p>
        <p>Your order number is: ${orderId}</p>
        <p>Order Summary:</p>
        <ul>
          ${updatedOrder.menuItems
            .map(
              (item: any) =>
                `<li>${item.quantity} x ${item.title} - $${item.priceAtOrder}</li>`
            )
            .join("")}
        </ul>
        <p>Total Amount: $${updatedOrder.totalAmount / 100}</p>
        <p>Your order is now being processed. You will receive an update once it ships.</p>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Thank you for shopping with us!</p>
      `;
        let user = null;
        if (updatedOrder.userId) {
          user = await User.findById(updatedOrder.userId);
        }

        const email = updatedOrder.userId
          ? user?.email
          : updatedOrder.guestEmail;

        const mailOptions = {
          from: process.env.EMAIL_USER, // Sender email address
          to: email, // Customer's email address
          subject: "Order Confirmation - " + orderId, // Email subject
          html: emailContent, // HTML content of the email
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);

        // 2. Update menu item stock levels
        await Promise.all(
          updatedOrder.menuItems.map(async (item: any) => {
            const menuItem = await MenuItem.findById(item.menuItemId).session(
              session
            );

            if (menuItem && !menuItem.isMadeToOrder) {
              const newStock = menuItem.stock - item.quantity;
              if (newStock < 0) {
                console.warn(`Insufficient stock for item ${menuItem._id}`);
                // Handle out-of-stock scenario (e.g., notify admin)
              } else {
                await MenuItem.findByIdAndUpdate(
                  item.menuItemId,
                  { $inc: { stock: -item.quantity } },
                  { session }
                );
              }
            }
          })
        );

        // 3. Update user reward points if logged in
        if (updatedOrder.userId) {
          const pointsToAdd = Math.floor(updatedOrder.totalAmount / 100);
          await User.findByIdAndUpdate(
            updatedOrder.userId,
            { $inc: { rewardPoints: pointsToAdd } },
            { session }
          );
        }

        // Commit the transaction
        await session.commitTransaction();
        console.log(`✅ Order ${orderId} successfully processed`);
      } catch (transactionError) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        console.error("❌ Transaction aborted:", transactionError);
        throw transactionError;
      } finally {
        session.endSession();
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}
