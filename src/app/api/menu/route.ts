import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MenuItem from "@/models/MenuItem";

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
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);

    const newItem = await MenuItem.create(body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("Error creating item:", err);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
