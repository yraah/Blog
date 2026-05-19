import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 🔍 get user
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔐 VERY IMPORTANT: use await
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
    });

    return response;
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}