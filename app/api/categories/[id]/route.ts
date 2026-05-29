import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ MUST be Promise
) {
  const { id } = await params; // ✅ now this is correct

  try {
    await db.query("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Category deleted permanently",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}