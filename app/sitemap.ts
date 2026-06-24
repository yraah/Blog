import type { MetadataRoute } from "next";
import { homeService } from "@/services/home.service";
import type { PostCreateBody } from "@/types/posts"; // ✅ import type
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 🔥 fetch posts (for dynamic slugs)
    let posts: PostCreateBody[] = [];

  try {
    posts = await homeService.getPosts();
  } catch (error) {
    console.error("Sitemap fetch failed:", error);
  }

  return [
    // ✅ Homepage
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },

    // ✅ Dynamic post pages
    ...posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(),
    })),
  ];
}