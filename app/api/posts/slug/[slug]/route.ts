import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { PostRow } from "@/types/posts";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [rows] = await db.query<PostRow[]>(
      "SELECT * FROM posts WHERE slug = ?",
      [slug]
    );

    return NextResponse.json(rows[0] || null);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}