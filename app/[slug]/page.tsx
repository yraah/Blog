import type { CSSProperties } from "react";
type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(
    `http://localhost:3000/api/posts/slug/${slug}`,
    { cache: "no-store" }
  );

  const post = await res.json();

  return {
    title: post?.meta_title || post?.title || "Casino Blog",
    description: post?.meta_description || post?.description || "",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(
    `http://localhost:3000/api/posts/slug/${slug}`,
    { cache: "no-store" }
  );

  const post = await res.json();

  if (!post) {
    return (
      <div style={styles.wrapper}>
        Post not found
      </div>
    );
  }

  const cleanText = (html: string) => { return html .replace(/<[^>]+>/g, "") }// remove HTML tags .replace(/&nbsp;/g, " ") // replace &nbsp; with space .replace(/&amp;/g, "&") // optional: decode common entities .replace(/&lt;/g, "<") .replace(/&gt;/g, ">") .trim(); };

  return (
    <div style={styles.page}>

      {/* HERO 2 COLUMN */}
      <div style={styles.heroRow}>

        {/* LEFT: IMAGE */}
        {post?.image && (
          <div style={styles.heroImageBox}>
            <img
              src={post.image}
              alt={post.title}
              style={styles.heroImage}
            />
          </div>
        )}

        {/* RIGHT: INFO */}
        <div style={styles.heroContent}>
          <a href="/" style={styles.backBtn}>← Back</a>

          <h1 style={styles.heroTitle}>
            {cleanText(post.title)}
          </h1>

          <p style={styles.meta}>
            🎰 Casino Blog • {post.category || "Strategy"} • {new Date().toDateString()}
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        <div style={styles.content}>
          <div
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </div>
      </div>

    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
page: {
  minHeight: "100vh",
  fontFamily: "Inter, Arial, sans-serif",

  background: `
    radial-gradient(circle at top left, rgba(177,94,255,0.15), transparent 35%),
    radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 35%),
    linear-gradient(180deg, #fdfcff 0%, #f5f0ff 50%, #ffffff 100%)
  `,
},

  /* HERO 2-COLUMN */
  heroRow: {
    maxWidth: "1200px",
    margin: "40px auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    padding: "0 20px",
    alignItems: "center",
  },

  heroImageBox: {
    width: "100%",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#000",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // no crop
    display: "block",
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  heroTitle: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  meta: {
    fontSize: "13px",
    color: "#6b7280",
  },

  summary: {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
  },

  backBtn: {
    display: "inline-block",
    width: "fit-content",
    color: "#111",
    textDecoration: "none",
    background: "#e5e7eb",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  /* CONTENT */
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
  },

  content: {
    fontSize: "17px",
    lineHeight: "1.9",
    color: "#1f2937",
  },
};