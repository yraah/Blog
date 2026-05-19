import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await db.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Category deleted permanently",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}