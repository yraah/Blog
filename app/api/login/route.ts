import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import type { LoginBody, UserRow } from "@/types/users";

export async function POST(request: NextRequest) {
  try {
    const { username, password }: LoginBody = await request.json();

    // 🔍 get user
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const user = (rows as UserRow[])[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ success
    const response = NextResponse.json({
      message: "Login success",
    });

    response.cookies.set("token", "admin-token", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.log("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}