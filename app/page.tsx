"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

type Category = {
  id: number;
  name: string;
  icon: string
};

type PostForm = {
  id: number
  title: string;
  description: string;
  category: string;
  slug: string;
  image: string;
};

export default function Home() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const [posts, setPosts] = useState<PostForm[]>([]);
  const [active, setActive] = useState("Slots");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔥 FETCH POSTS
        const postRes = await fetch("/api/posts");
        const postData = await postRes.json();

        // 🔥 FETCH CATEGORIES
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();

        setPosts(Array.isArray(postData) ? postData : []);
        setCategories(Array.isArray(catData) ? catData : []);

        // ✅ set default active category
        if (catData?.length > 0) {
          setActive(catData[0].name);
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(posts.length, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, [posts]);

  // 🔍 FILTER BY CATEGORY
  const filtered = posts.filter(
    (p) => p.category?.toLowerCase() === active.toLowerCase()
  );

  const cleanText = (html: string, limit = 120) => {
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div style={styles.container}>
      {/* HERO */}
      <div style={styles.hero}>
        {posts.slice(0, 5).map((post, index) => (
          <div
            key={post.id}
            style={{
              ...styles.slide,
              opacity: current === index ? 1 : 0,
              zIndex: current === index ? 1 : 0,
            }}
          >
            <img src={post.image} alt={post.title} style={styles.heroImg} />

            <div style={styles.heroOverlay}>
              <h1 style={styles.heroTitle}>{cleanText(post.title)}</h1>
              <p style={styles.heroSubtitle}>
                {cleanText(post.description, 100)}
              </p>

              <button
                style={styles.readBtn}
                onClick={() => router.push(`/${post.slug}`)}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div style={styles.dots}>
          {posts.slice(0, 5).map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                ...styles.dot,
                opacity: current === i ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* CATEGORY */}
      <div style={styles.categoryWrapper}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.name)}
            style={{
              ...styles.categoryBtn,
              ...(active === cat.name ? styles.activeCategory : {}),
            }}
          >
            {cat.icon && (
              <img src={cat.icon} alt={cat.name} style={styles.icon} />
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {loading ? (
          <p style={styles.message}>Loading posts...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.message}>No posts found</p>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              style={styles.card}
              onClick={() => router.push(`/${post.slug}`)}
            >
              <div style={styles.imageWrapper}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={styles.cardImage}
                />
                <span style={styles.badge}>{post.category}</span>
              </div>

              <div style={styles.cardContent}>
                <h3 style={styles.title}>
                  {cleanText(post.title, 60)}
                </h3>
                <p style={styles.desc}>
                  {cleanText(post.description, 120)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "clamp(10px, 3vw, 20px)",
    fontFamily: "Inter, Arial, sans-serif",
    background: `
      radial-gradient(circle at top left, rgba(177,94,255,0.18), transparent 35%),
      radial-gradient(circle at bottom right, rgba(139,92,246,0.15), transparent 35%),
      linear-gradient(180deg, #fdfcff 0%, #f5f0ff 50%, #ffffff 100%)
    `,
  },

  hero: {
    position: "relative",
    maxWidth: "1400px",
    margin: "0 auto 40px",
    height: "clamp(220px, 50vw, 420px)", // ✅ responsive
    borderRadius: "16px",
    overflow: "hidden",
  },

  slide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transition: "opacity 0.6s ease",
  },

  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "clamp(15px, 4vw, 40px)", // ✅ responsive padding
    background:
      "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
    color: "#fff",
  },

  heroTitle: {
    fontSize: "clamp(18px, 3vw, 28px)", // ✅ responsive text
    fontWeight: "700",
    marginBottom: "10px",
  },

  heroSubtitle: {
    fontSize: "clamp(12px, 2vw, 14px)",
    marginBottom: "12px",
    opacity: 0.9,
  },

  readBtn: {
    background: "#fff",
    color: "#111",
    border: "none",
    padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "clamp(12px, 2vw, 14px)",
  },

  /* DOTS */
  dots: {
    position: "absolute",
    bottom: "clamp(10px, 2vw, 15px)",
    right: "clamp(10px, 3vw, 20px)",
    display: "flex",
    gap: "8px",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#fff",
    cursor: "pointer",
  },

  /* CATEGORY */
  categoryWrapper: {
    maxWidth: "1400px",
    margin: "0 auto 25px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    overflowX: "auto", // ✅ mobile scroll
  },

  categoryBtn: {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid #B15EFF",
    background: "#B15EFF",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "clamp(12px, 2vw, 13px)",
    fontWeight: "500",
    transition: "0.2s",
    color: "#fff",
    boxShadow: "0 0 10px rgba(177, 94, 255, 0.5)",
    whiteSpace: "nowrap",
  },

  activeCategory: {
    background: "#c3a7ff",
    color: "#fff",
    border: "1px solid #c3a7ff",
  },

  icon: {
    width: "16px",
    height: "16px",
  },

  /* GRID */
  grid: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // ✅ responsive grid
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.25s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  imageWrapper: {
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "clamp(160px, 25vw, 200px)", // ✅ responsive image
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "#111827",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
  },

  cardContent: {
    padding: "clamp(12px, 2vw, 15px)",
  },

  title: {
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#111827",
  },

  desc: {
    fontSize: "clamp(12px, 1.8vw, 13px)",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  message: {
    textAlign: "center",
    width: "100%",
    color: "#6b7280",
  },
};