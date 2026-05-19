import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, email, password, first_name, last_name } =
      await req.json();

    // 🔍 check if user exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return Response.json(
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

    return Response.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}