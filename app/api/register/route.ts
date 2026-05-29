import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { RegisterBody, UserRow } from "@/types/users";

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
    }: RegisterBody = await req.json();

    // 🔍 check if user exists
    const [existing] = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 }
      );
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ insert user
    await db.query(
      `INSERT INTO users (username, email, password, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, first_name, last_name]
    );

    return NextResponse.json({
      message: "User registered successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}