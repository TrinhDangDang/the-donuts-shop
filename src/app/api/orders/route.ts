import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";

export async function GET(req: Request) {
  try {
    // Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as {
      userId: string;
      userRole: string;
    };

    // Database connection with model verification
    await dbConnect();

    // Debug: Check registered models
    console.log("Registered models:", Object.keys(mongoose.models));

    // Explicit model registration if needed
    if (!mongoose.models.MenuItem) {
      console.log("Registering MenuItem model");
      require("@/models/MenuItem");
    }
    if (!mongoose.models.Order) {
      console.log("Registering Order model");
      require("@/models/Order");
    }

    // Query with population
    const orders = await Order.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "menuItems.menuItemId",
        model: "MenuItem",
        // Only get necessary fields
      });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("Order fetch error:", {
      error: error.message,
      stack: error.stack,
      models: Object.keys(mongoose.models || {}),
    });

    return NextResponse.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
