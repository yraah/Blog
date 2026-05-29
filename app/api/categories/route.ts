import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { CategoryBody } from "@/types/category";

export async function POST(req: NextRequest) {
  try {
    const { name, icon }: CategoryBody = await req.json();

    await db.query(
      "INSERT INTO categories (name, icon) VALUES (?, ?)",
      [name, icon]
    );

    return NextResponse.json({ message: "Created" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE is_deleted = 0 ORDER BY name ASC"
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}