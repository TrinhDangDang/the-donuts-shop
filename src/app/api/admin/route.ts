import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // Authorization check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded: { userId: string; userRole: string };
    try {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as {
        userId: string;
        userRole: string;
      };
      if (decoded.userRole !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Token expired or invalid" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get orders with populated data
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({ path: "menuItems.menuItemId", model: MenuItem })
      .populate({ path: "userId", model: User })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("GET /orders error", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    // Authorization check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded: { userId: string; userRole: string };
    try {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as {
        userId: string;
        userRole: string;
      };
      if (decoded.userRole !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Token expired or invalid" },
        { status: 401 }
      );
    }

    // Parse request body
    const { orderId, updatedStatus } = await req.json();

    if (!orderId || !updatedStatus) {
      return NextResponse.json(
        { message: "Missing orderId or updatedStatus" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: updatedStatus },
      { new: true } // Return the updated document
    )
      .populate({ path: "menuItems.menuItemId", model: MenuItem })
      .populate({ path: "userId", model: User })
      .lean();

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /orders error", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
