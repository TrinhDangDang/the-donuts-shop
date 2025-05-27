import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MenuItem from "@/models/MenuItem";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // 2. Authorization
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as {
      userId: string;
      userRole: string;
    };

    if (decoded.userRole !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.log("PARAMS:", params);

    // 3. Get ID from URL params
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 4. Find and delete with Cloudinary cleanup
    const item = await MenuItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    if (item.publicId) {
      await cloudinary.uploader
        .destroy(item.publicId)
        .catch((err) => console.error("Cloudinary deletion error:", err));
    }

    await MenuItem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
