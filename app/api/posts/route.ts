import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { PostRow, PostBody } from "@/types/posts";

export async function GET() {
  try {
    const [rows] = await db.query<PostRow[]>(
      "SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: PostBody = await req.json();

    const {
      title,
      category,
      description,
      image,
      meta_title,
      meta_description,
      alt_image_name,
    } = body;

    const cleanTitle = title.replace(/<[^>]+>/g, "");

    const slug = cleanTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    await db.query(
      `INSERT INTO posts 
      (title, slug, category, description, image, meta_title, meta_description, alt_image_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanTitle,
        slug,
        category,
        description,
        image,
        meta_title,
        meta_description,
        alt_image_name,
      ]
    );

    return NextResponse.json({
      message: "Post created",
      slug,
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