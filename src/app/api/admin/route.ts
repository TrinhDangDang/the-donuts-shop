import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

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

//UPDATE ORDER STATUS

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

/* 

HANDLE ADD NEW ITEM TO THE MENU. 
⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
*/

export async function POST(req: Request) {
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

    // Handle FormData
    const formData = await req.formData();

    // Extract fields from formData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const isMadeToOrder = formData.get("isMadeToOrder") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title || isNaN(price)) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Handle stock data differently based on isMadeToOrder
    let stockData = null;
    if (!isMadeToOrder) {
      const quantity = parseInt(formData.get("quantity") as string) || 0;
      stockData = {
        quantity: quantity,
        lowStockAlert: 5, // Default value
        autoDisable: true, // Default value
      };
    }

    let imageUrl = null;
    let publicId = null;

    if (imageFile) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");
        const dataURI = `data:${imageFile.type};base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "menuItems",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
        publicId = result.public_id;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }
    // Create menu item in database
    const newItem = await MenuItem.create({
      title,
      description,
      price,
      isMadeToOrder,
      stock: stockData, // Will be null if isMadeToOrder is true
      imageUrl,
      publicId,
      inStock: isMadeToOrder ? true : stockData!.quantity > 0, // Set initial inStock status
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("Error creating item with image:", err);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
