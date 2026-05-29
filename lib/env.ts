// lib/env.ts
// Centralizes all environment variable access.
// Import from here instead of using process.env directly across the codebase.

export const env = {
  // Database (server-side only)
  db: {
    host:     process.env.DB_HOST     ?? "127.0.0.1",
    user:     process.env.DB_USER     ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name:     process.env.DB_NAME     ?? "blog_db",
    port:     Number(process.env.DB_PORT ?? 3306),
  },

  // Auth (server-side only)
  jwtSecret: process.env.JWT_SECRET ?? "",

  // Cloudinary (server-side only)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey:    process.env.CLOUDINARY_API_KEY    ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },

  // Public (safe to use client-side)
  apiUrl:  process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:3000/api",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
