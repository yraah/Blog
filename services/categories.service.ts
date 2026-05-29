// services/categories.service.ts
import apiClient from "./apiClient";
import type { CategoryBody, CategoryRow } from "@/types/category";
import { API_ROUTES } from "@/lib/constants";

export const categoriesService = {
  getAll: () =>
    apiClient.get<CategoryRow[]>(API_ROUTES.categories),

  getById: (id: number) =>
    apiClient.get<CategoryRow>(`${API_ROUTES.categories}/${id}`),

  create: (data: CategoryBody) =>
    apiClient.post(API_ROUTES.categories, data),

  update: (id: number, data: CategoryBody) =>
    apiClient.put(`${API_ROUTES.categories}/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`${API_ROUTES.categories}/${id}`),
};
