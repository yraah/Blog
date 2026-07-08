"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/home.module.css";

// --- Types ---
type Category = { id: number; name: string; icon: string };
type PostForm = { id: number; title: string; description: string; category: string; slug: string; image: string };

// --- Pure utils (outside component — never re-created on render) ---
const cleanText = (html: string, limit = 120): string => {
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// Static skeleton count — no Math.random()
const SKELETON_COUNT = [1, 2, 3, 4, 5, 6];

// --- Skeleton fallbacks ---
function HeroSkeleton() {
  return <div className={styles.heroSkeleton} />;
}

function GridSkeleton() {
  return (
    <>
      {SKELETON_COUNT.map((i) => (
        <div key={i} className={styles.cardSkeleton} />
      ))}
    </>
  );
}

// --- Component ---
export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<PostForm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState("");
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- SEO meta tags (run once) ---
  useEffect(() => {
    const TITLE = "Casino Tips, Bonuses & Winning Guides Philippines | Yoller";
    const DESCRIPTION = "Explore Yoller Casino Blog for slots tips, casino strategies, bonus guides, and beginner-friendly content created for all players.";
    const URL = "https://blog.yoller.com/";
    const IMAGE = "https://blog.yoller.com/default-og.jpg";

    document.title = TITLE;

    const setMeta = (key: string, value: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      const selector = `meta[${attr}="${key}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("description", DESCRIPTION);
    setMeta("robots", "index, follow");
    setLink("canonical", URL);
    setMeta("og:title", TITLE, true);
    setMeta("og:description", DESCRIPTION, true);
    setMeta("og:url", URL, true);
    setMeta("og:type", "website", true);
    setMeta("og:image", IMAGE, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", TITLE);
    setMeta("twitter:description", DESCRIPTION);
    setMeta("twitter:image", IMAGE);
    setMeta("twitter:site", "@your_twitter_handle");
  }, []);

  // --- Data fetch with retry (useRef pattern to avoid self-reference) ---
  const fetchDataRef = useRef<() => Promise<void>>(async () => { });

  const fetchData = useCallback(async (retry = 2) => {
    try {
      setLoading(true);

      const [catRes] = await Promise.all([
        fetch("/api/categories"),
      ]);

      const [catData] = await Promise.all([
        catRes.json(),
      ]);

      setCategories(Array.isArray(catData) ? catData : []);

      if (catData?.length > 0) setActive(catData[0].name);
    } catch (err) {
      if (retry > 0) {
        setTimeout(() => fetchDataRef.current(), 800);
        return;
      }
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostsByCategory = async (category: string, page = 1) => {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/posts?category=${category}&page=${page}&limit=10`
    );

    const data = await res.json();

    setPosts(data);
  } catch (err) {
    console.error("Error fetching posts:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDataRef.current = () => fetchData();
  }, [fetchData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // --- Hero carousel interval ---
  useEffect(() => {
    if (posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(posts.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [posts.length]);

  // useMemo — hero slides only recomputed when posts changes
  const heroSlides = useMemo(() => posts.slice(0, 5), [posts]);

  // useMemo — filtered posts only recomputed when posts or active changes
  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        !active ||
        post.category?.toLowerCase() === active.toLowerCase();

      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        cleanText(post.description)
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, active, search]);

  // useCallback — stable navigation reference
  const navigateTo = useCallback(
    (slug: string) => router.push(`/${slug}`),
    [router]
  );

  // useCallback — stable dot/category click references
  const handleDotClick = useCallback((i: number) => setCurrent(i), []);
  const handleCategoryClick = useCallback((name: string) => {
  setActive(name);
  fetchPostsByCategory(name); // 🔥 ADD THIS
}, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>
        Yoller Blog: News, Tips & Insights
      </h1>
      {/* HERO */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        <div className={styles.hero}>
          {heroSlides.map((post, index) => (
            <div
              key={post.id}
              className={styles.slide}
              style={{ opacity: current === index ? 1 : 0, zIndex: current === index ? 1 : 0 }}
            >
              <img src={post.image} alt={post.title} className={styles.heroImg} loading="lazy" />

              <div className={styles.heroOverlay}>
                <h2 className={styles.heroTitle}>{cleanText(post.title)}</h2>
                <p className={styles.heroSubtitle}>{cleanText(post.description, 100)}</p>

                <button className={styles.readBtn} onClick={() => navigateTo(post.slug)}>
                  Read More →
                </button>
              </div>
            </div>
          ))}

          {/* DOTS */}
          <div className={styles.dots}>
            {heroSlides.map((_, i) => (
              <span
                key={i}
                className={styles.dot}
                onClick={() => handleDotClick(i)}
                style={{ opacity: current === i ? 1 : 0.4 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>
     

      {/* CATEGORY */}
      <div className={styles.categoryWrapper}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className={`${styles.categoryBtn} ${active === cat.name ? styles.activeCategory : ""}`}
          >
            {cat.icon && <img src={cat.icon} alt={cat.name} className={styles.icon} loading="lazy" />}
            {cat.name}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {loading ? (
          <GridSkeleton />
        ) : filtered.length === 0 ? (
          <p className={styles.message}>No posts found</p>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className={styles.card} onClick={() => navigateTo(post.slug)}>
              <div className={styles.imageWrapper}>
                <img src={post.image} alt={post.title} className={styles.cardImage} loading="lazy" />
                <span className={styles.badge}>{post.category}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{cleanText(post.title, 60)}</h3>
                <p className={styles.desc}>{cleanText(post.description, 120)}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
