// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  const { email, password, staySignedIn } = await req.json();
  await dbConnect();

  const user = await User.findOne({ email });
  const isValid = user && (await bcrypt.compare(password, user.password));

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ accessToken });
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh",
    maxAge: staySignedIn ? 60 * 60 * 24 * 7 : undefined,
  });

  return res;
}
