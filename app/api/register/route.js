// pages/api/register.js

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request) {
  const { fullName, email, phoneNumber } = await request.json(); // Adjusted to match the specified keys

  if (!fullName || !email || !phoneNumber) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Example: Posting data to your Strapi API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/students`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({data:{
        fullName,
        email,
        phoneNumber,
      }}),
    }

  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }

  const data = await res.json();

const userID=data.data.id;


  // Create a JWT token for authentication
  const token = await new SignJWT({ fullName, email, id: userID })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Return the response with userId and token
  const response = NextResponse.json({
    message: "Registered successfully",
    id: userID,
  });
  response.cookies.set("user-token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return response;
}
