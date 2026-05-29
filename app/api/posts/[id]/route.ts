import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { PostRow } from "@/types/posts";


// ✅ DELETE (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    await db.query(
      "UPDATE posts SET deleted_at = NOW() WHERE id = ?",
      [postId]
    );

    return NextResponse.json({ message: "Soft deleted" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


// ✅ PUT (update)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      title,
      category,
      description,
      image,
      meta_title,
      meta_description,
      alt_image_name,
    } = body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    await db.query(
      `UPDATE posts SET 
        title=?,
        slug=?,
        category=?,
        description=?,
        image=?,
        meta_title=?,
        meta_description=?,
        alt_image_name=?
       WHERE id=?`,
      [
        title,
        slug,
        category,
        description,
        image,
        meta_title,
        meta_description,
        alt_image_name,
        postId,
      ]
    );

    return NextResponse.json({ message: "Post updated" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


// ✅ GET (by slug OR id depending on your route)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ⚠️ match folder name
) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    );

    return NextResponse.json((rows as PostRow[])[0] || null);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}