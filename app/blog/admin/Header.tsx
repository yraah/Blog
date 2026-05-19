"use client";

import { Dropdown, Button, Typography } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  FileAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function Header() {

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/blog/admin/login";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#392467",
      }}
    >
      {/* LEFT SIDE - TITLE */}
      <Text strong style={{ fontSize: 16 , color:'#fff' }}>
        ADMIN DASHBOARD
      </Text>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Logout Button (RIGHT MOST) */}
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}