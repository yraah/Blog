// app/blog/admin/LogoutButton.tsx
// FIX: Duplicate of Header.tsx logout — now both use authService directly.
// FIX: No inline error string; uses formatError for consistency.

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { authService } from "@/services/auth.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { ROUTES } from "@/lib/constants";
import styles from "@/styles/button.module.css";

export default function LogoutButton() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await withRetry(() => authService.logout());
      localStorage.removeItem("token");
      message.success("Logged out successfully");
      router.push(ROUTES.adminLogin);
      router.refresh();
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <button onClick={logout} disabled={loading} className={styles.logout}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
