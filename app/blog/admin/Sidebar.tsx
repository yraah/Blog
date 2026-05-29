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

import styles from "@/styles/sidebar.module.css";

const { Sider } = Layout;

type SidebarProps = {
  setPage: (page: string) => void;
};

export default function Sidebar({ setPage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: "Posts",
    },
    {
      key: "category",
      icon: <AppstoreOutlined />,
      label: "Category",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      className={styles.sider}
    >
      {/* HEADER */}
      <div className={styles.header}>
        {collapsed ? "AP" : "ADMIN PANEL"}
      </div>

      {/* MENU */}
      <div style={{ flex: 1 }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[]}
          className={styles.menu}
          items={menuItems}
          onClick={(e) => setPage(e.key)}
        />
      </div>

      {/* TOGGLE */}
      <div className={styles.toggle}>
        <Button
          block
          type="primary"
          onClick={() => setCollapsed(!collapsed)}
          icon={
            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
        />
      </div>
    </Sider>
  );
}