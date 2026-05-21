import { db } from "@/lib/db";


export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY id DESC"
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
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

    return Response.json({ message: "Post created", slug });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}