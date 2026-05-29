// app/blog/admin/Header.tsx
// FIX: logoutWithRetry inline function removed — now uses shared withRetry util.

"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { message } from "antd";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { ROUTES } from "@/lib/constants";
import styles from "@/styles/header.module.css";

const Button         = dynamic(() => import("antd").then((m) => m.Button),                    { ssr: false });
const Text           = dynamic(() => import("antd").then((m) => m.Typography.Text),           { ssr: false });
const LogoutOutlined = dynamic(() => import("@ant-design/icons").then((m) => m.LogoutOutlined), { ssr: false });

export default function Header() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await withRetry(() => authService.logout());
      message.success("Logged out successfully");
      router.push(ROUTES.adminLogin);
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <Text className={styles.title}>ADMIN DASHBOARD</Text>

      <div className={styles.actions}>
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout} loading={loading}>
          Logout
        </Button>
      </div>
    </div>
  );
}
