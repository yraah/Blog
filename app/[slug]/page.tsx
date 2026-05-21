import type { CSSProperties } from "react";
type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  

  const cleanSlug = (text: string) => {
  return text
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/&[^;]+;/g, "") // remove HTML entities
    .replace(/[^a-zA-Z0-9\s-]/g, "") // remove weird chars
    .trim()
    .replace(/\s+/g, "-") // spaces → dash
    .toLowerCase();
};
const safeSlug = cleanSlug(slug);

const res = await fetch(
  `http://localhost:3000/api/posts/slug/${safeSlug}`,
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
    alternates: {
      canonical: `https://blog.yoller.com/${safeSlug}`,
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
    padding: "clamp(10px, 3vw, 20px)",
    background: `
      radial-gradient(circle at top left, rgba(177,94,255,0.15), transparent 35%),
      radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 35%),
      linear-gradient(180deg, #fdfcff 0%, #f5f0ff 50%, #ffffff 100%)
    `,
  },

  /* HERO 2-COLUMN */
  heroRow: {
    maxWidth: "1200px",
    margin: "clamp(20px, 5vw, 40px) auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // ✅ auto responsive
    gap: "clamp(15px, 3vw, 30px)",
    padding: "0 clamp(10px, 3vw, 20px)",
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
    height: "clamp(220px, 35vw, 420px)", // ✅ responsive height
    objectFit: "contain",
    display: "block",
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  heroTitle: {
    fontSize: "clamp(22px, 4vw, 38px)", // ✅ responsive text
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    lineHeight: "1.2",
  },

  meta: {
    fontSize: "clamp(12px, 2vw, 13px)",
    color: "#6b7280",
  },

  summary: {
    fontSize: "clamp(14px, 2vw, 15px)",
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
    margin: "clamp(20px, 5vw, 40px) auto",
    padding: "0 clamp(10px, 3vw, 20px)",
  },

  content: {
    fontSize: "clamp(15px, 2.5vw, 17px)", // ✅ readable on mobile
    lineHeight: "1.9",
    color: "#1f2937",
  },
};