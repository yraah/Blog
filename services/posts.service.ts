// services/posts.service.ts
// FIX: Types updated to use new PascalCase names (PostRow, PostBody, PostCreateBody).

import apiClient from "./apiClient";
import type { PostRow, PostBody, PostCreateBody } from "@/types/posts";
import { API_ROUTES } from "@/lib/constants";

export const postsService = {
  getAll: () =>
    apiClient.get<PostRow[]>(API_ROUTES.posts),

  getBySlug: (slug: string) =>
    apiClient.get<PostRow>(`${API_ROUTES.posts}/slug/${slug}`),

  create: (data: PostCreateBody) =>
    apiClient.post(API_ROUTES.posts, data),

  update: (id: number, data: PostBody) =>
    apiClient.put(`${API_ROUTES.posts}/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`${API_ROUTES.posts}/${id}`),
};
