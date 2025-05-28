import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MenuItem from "@/models/MenuItem";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await dbConnect();
    const items = await MenuItem.find();
    return NextResponse.json(items);
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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

    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const isMadeToOrder = formData.get("isMadeToOrder") === "true";
    const inStock = formData.get("inStock") === "true";
    const quantity = formData.get("quantity")
      ? parseInt(formData.get("quantity") as string)
      : 0;
    const imageFile = formData.get("image") as File | null;

    console.log("=== Form Data Received ===");
    console.log("Title:", title, "Type:", typeof title);
    console.log("Description:", description, "Type:", typeof description);
    console.log("Price:", price, "Type:", typeof price, "isNaN:", isNaN(price));

    if (imageFile) {
      console.log("Image File:", {
        name: imageFile.name,
        type: imageFile.type,
        size: `${(imageFile.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(imageFile.lastModified).toISOString(),
      });
    } else {
      console.log("No image file provided");
    }
    await dbConnect();

    const existingItem = await MenuItem.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingItem.imageUrl;
    let publicId = existingItem.publicId;
    console.log(publicId);
    if (imageFile) {
      try {
        // Delete old image if exists
        if (publicId) {
          await cloudinary.uploader
            .destroy(publicId)
            .catch((err) => console.error("Cloudinary deletion error:", err));
        }

        // Upload new image
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
    const updateData: any = {
      title,
      description,
      price,
      isMadeToOrder,
      inStock,
      imageUrl,
      publicId,
      stock: quantity,
    };

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { message: "Menu item updated successfully", data: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE error:", error);

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
