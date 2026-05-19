"use client";

import { useState } from "react";
import { Layout } from "antd";

import Sidebar from "./Sidebar";
import Header from "./Header";
import PostsTable from "./PostsTable";
import CategoryTable from "./CategoryTable";
import DashboardContent from "./DashboardContent";

const { Content } = Layout;

export default function AdminClient() {
  const [page, setPage] = useState("dashboard");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar setPage={setPage} />

      <Layout>
        <Header />

        <Content style={{ padding: 20, backgroundColor:'#ffffff' }}>
          {page === "dashboard" && <DashboardContent />}

          {page === "posts" && <PostsTable />}

          {page === "category" && <CategoryTable />}
        </Content>
      </Layout>
    </Layout>
  );
}