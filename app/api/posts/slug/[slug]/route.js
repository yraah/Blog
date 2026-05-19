import { db } from "@/lib/db";

export async function GET(req, { params }) {
  const { slug } = await params;

  const [rows] = await db.query(
    "SELECT * FROM posts WHERE slug = ?",
    [slug]
  );

  return Response.json(rows[0] || null);
}