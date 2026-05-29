"use client";

import {Image} from "antd"
import Link from "next/link";
import { SITE, ROUTES } from "@/lib/constants";
import styles from "./page.module.css";

type Post = {
  title:      string;
  image?:     string;
  category?:  string;
  created_at?: string;
};

export default function PostHero({ post }: { post: Post }) {
  const dateLabel = post.created_at
    ? new Date(post.created_at).toDateString()
    : new Date().toDateString();

  return (
    <div className={styles.heroRow}>
      {post.image && (
        <div className={styles.heroImageBox}>
          {/* FIX: next/image instead of Ant Design Image */}
          <Image
            src={post.image}
            alt={post.title}
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      <div className={styles.heroContent}>
        <Link href={ROUTES.home} className={styles.backBtn}>
          ← Back
        </Link>

        <h1 className={styles.heroTitle}>{post.title}</h1>

        <p className={styles.meta}>
          🎰 {SITE.tagline} • {post.category || "Strategy"} • {dateLabel}
        </p>
      </div>
    </div>
  );
}
