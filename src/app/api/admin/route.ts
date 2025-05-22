import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
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
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("GET / orders error", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
