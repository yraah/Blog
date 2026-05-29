// services/auth.service.ts
// FIX: login() was sending { email, password } but LoginBody type uses { username, password }.
// Now correctly uses AuthLoginPayload with username.

import apiClient from "./apiClient";
import type { AuthLoginPayload, RegisterBody } from "@/types/users";
import { API_ROUTES } from "@/lib/constants";

export const authService = {
  login: (data: AuthLoginPayload) =>
    apiClient.post(API_ROUTES.login, data),

  register: (data: RegisterBody) =>
    apiClient.post(API_ROUTES.register, data),

  logout: () =>
    apiClient.post(API_ROUTES.logout),
};
