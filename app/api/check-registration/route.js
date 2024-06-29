// pages/api/check-registration.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request) {
  const token = request.cookies["user-token"];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 403 });
  }

  try {
    // Verify JWT token
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // If authenticated, return success
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    // If token is invalid, return error
    console.error("Invalid token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
