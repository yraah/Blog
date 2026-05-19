import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, icon } = await req.json();

    await db.query(
      "INSERT INTO categories (name, icon) VALUES (?, ?)",
      [name, icon]
    );

    return Response.json({ message: "Created" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE is_deleted = 0 ORDER BY name ASC"
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}