// services/users.service.ts
import apiClient from "./apiClient";
import type { UserRow, RegisterBody } from "@/types/users";
import { API_ROUTES } from "@/lib/constants";

export const usersService = {
  getAll: () =>
    apiClient.get<UserRow[]>(API_ROUTES.users),

  getById: (id: number) =>
    apiClient.get<UserRow>(`${API_ROUTES.users}/${id}`),

  update: (id: number, data: Partial<RegisterBody>) =>
    apiClient.put(`${API_ROUTES.users}/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`${API_ROUTES.users}/${id}`),
};
