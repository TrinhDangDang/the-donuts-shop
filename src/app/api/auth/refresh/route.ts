// app/api/auth/refresh/route.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET!
    ) as any;
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET!,
      { expiresIn: "15m" }
    );
    return NextResponse.json({ accessToken: newAccessToken });
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
