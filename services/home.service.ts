// services/home.service.ts
// FIX: Was using apiFetch() from utils/api.ts while all other services used apiClient.
// Now uses apiClient for consistency.

import apiClient from "./apiClient";
import type { PostRow } from "@/types/posts";
import type { CategoryRow } from "@/types/category";
import { API_ROUTES } from "@/lib/constants";

export const homeService = {
  getPosts: async (): Promise<PostRow[]> => {
    const res = await apiClient.get<PostRow[]>(API_ROUTES.posts);
    return res.data;
  },

  getCategories: async (): Promise<CategoryRow[]> => {
    const res = await apiClient.get<CategoryRow[]>(API_ROUTES.categories);
    return res.data;
  },
};
