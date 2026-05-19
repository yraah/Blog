"use client";

import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Sider } = Layout;

type SidebarProps = {
  setPage: (page: string) => void;
};

export default function Sidebar({ setPage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => setPage("dashboard"),
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: "Posts",
      onClick: () => setPage("posts"), // 🔥 SHOW TABLE
    },
    {
      key: "category",
      icon: <AppstoreOutlined />,
      label: "Category",
      onClick: () => setPage("category"),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor:'#392467'
      }}
    >
      <div
        style={{
          color: "#fff",
          padding: 16,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {collapsed ? "AP" : "ADMIN PANEL"}
      </div>

      <div style={{ flex: 1 }}>
        <Menu theme="dark" mode="inline" items={items}style={{
    backgroundColor: "#392467",
    color: "#fff",
  }} />
      </div>

      <div style={{ padding: 12 }}>
        <Button
          block
          type="primary"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      </div>
    </Sider>
  );
}