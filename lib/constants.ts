// lib/constants.ts
// All repeated values, magic strings, and config in one place.
// Import from here instead of scattering literals across the codebase.

export const SITE = {
  name:        "Yoller Blog",
  url:         process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: "/default-og.jpg",
  twitterHandle: "@your_twitter_handle",
  tagline:     "Casino Blog",
} as const;

export const PAGINATION = {
  defaultPageSize: 5,
} as const;

export const RETRY = {
  attempts: 2,
  delayMs:  800,
} as const;

export const UPLOAD = {
  maxCount:      1,
  acceptedTypes: "image/*",
} as const;

export const ROUTES = {
  home:        "/",
  adminLogin:  "/blog/admin/login",
  admin:       "/blog/admin",
} as const;

export const API_ROUTES = {
  posts:       "/posts",
  categories:  "/categories",
  upload:      "/upload",
  login:       "/login",
  logout:      "/logout",
  register:    "/register",
  users:       "/users",
} as const;
