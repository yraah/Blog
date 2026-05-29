// app/[slug]/page.tsx
// FIX: Removed hardcoded "http://localhost:3000" — now uses env.siteUrl
// FIX: Moved stripHtml and slugify to utils/text.ts (no duplication)
// FIX: Uses SITE constants instead of scattered string literals

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { env } from "@/lib/env";
import { SITE } from "@/lib/constants";
import { slugify, stripHtml } from "@/utils/text";

// --- Dynamic imports ---
const PostHero = dynamic(() => import("./PostHero"), {
  loading: () => <HeroSkeleton />,
  ssr: true,
});

const PostContent = dynamic(() => import("./PostContent"), {
  loading: () => <ContentSkeleton />,
  ssr: true,
});

// --- Skeleton fallbacks ---
function HeroSkeleton() {
  return (
    <div style={{ display: "flex", gap: 32, padding: 32 }}>
      <div style={{ width: 480, height: 320, background: "#e5e7eb", borderRadius: 12 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ height: 16, width: "30%", background: "#e5e7eb", borderRadius: 4 }} />
        <div style={{ height: 40, width: "80%", background: "#e5e7eb", borderRadius: 4 }} />
        <div style={{ height: 20, width: "50%", background: "#e5e7eb", borderRadius: 4 }} />
      </div>
    </div>
  );
}

const SKELETON_WIDTHS = [95, 82, 78, 91, 74, 88];

function ContentSkeleton() {
  return (
    <div style={{ padding: "0 32px 64px", display: "flex", flexDirection: "column", gap: 12 }}>
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={i}
          style={{ height: 18, width: `${width}%`, background: "#e5e7eb", borderRadius: 4 }}
        />
      ))}
    </div>
  );
}

// --- Data fetching ---
// FIX: Uses env.siteUrl instead of hardcoded localhost
async function getPost(slug: string) {
  try {
    const res = await fetch(`${env.siteUrl}/api/posts/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// --- Types ---
type Props = { params: Promise<{ slug: string }> };

// --- Metadata ---
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: SITE.tagline };

  const title       = post.meta_title       || post.title       || SITE.tagline;
  const description = post.meta_description || post.description || "";
  const url         = `${SITE.url}/${slugify(post.title)}`;
  const image       = post.image            || `${SITE.url}${SITE.defaultOgImage}`;

  return {
    title,
    description,
    robots:     { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      siteName: SITE.name,
      type:     "article",
      images:   [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:    "summary_large_image",
      title, description,
      images:  [image],
      creator: SITE.twitterHandle,
    },
  };
}

// --- Page ---
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <div style={{ padding: 32 }}>Post not found</div>;
  }

  const postData = {
    ...post,
    title: stripHtml(post.title),
  };

  return (
    <div>
      <Suspense fallback={<HeroSkeleton />}>
        <PostHero post={postData} />
      </Suspense>

      <Suspense fallback={<ContentSkeleton />}>
        <PostContent html={post.description} />
      </Suspense>
    </div>
  );
}
