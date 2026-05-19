import { db } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ FIX HERE

    console.log("Deleting ID:", id);

    await db.query(
      "UPDATE posts SET deleted_at = NOW() WHERE id = ?",
      [id]
    );

    return Response.json({ message: "Soft deleted" });
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = await params;

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
        alt_image_name, // ✅ NEW FIELD
        id,
      ]
    );

    return Response.json({ message: "Post updated" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(req, { params }) {
  const { slug } = await params;

  const [rows] = await db.query(
    "SELECT * FROM posts WHERE slug = ?",
    [slug]
  );

  return Response.json(rows[0] || null);
}