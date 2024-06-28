// pages/api/register.js

import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

export async function POST(request) {
  const { name, email, phone } = await request.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Generate a unique userID using UUID
  const userId = uuidv4(); // Generates a unique UUID (e.g., '1c65d3dc-64ea-4c12-a5a5-2fd0c3b17291')

  // Create a JWT token for authentication
  const token = await new SignJWT({ name, email, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Return the response with userId and token
  const response = NextResponse.json({
    message: "Registered successfully",
    userId,
  });
  response.cookies.set("user-token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return response;
}
