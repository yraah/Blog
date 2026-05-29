// services/upload.service.ts
import apiClient from "./apiClient";
import { API_ROUTES } from "@/lib/constants";

export const uploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<{ url: string }>(API_ROUTES.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
