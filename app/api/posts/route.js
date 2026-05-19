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
      alt_image_name, // ✅ NEW FIELD
    } = body;
console.log("IMAGE LENGTH:", image?.length);
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    await db.query(
      `INSERT INTO posts 
      (title, slug, category, description, image, meta_title, meta_description, alt_image_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        category,
        description,
        image,
        meta_title,
        meta_description,
        alt_image_name, // ✅ NEW FIELD
      ]
    );

    return Response.json({ message: "Post created" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}