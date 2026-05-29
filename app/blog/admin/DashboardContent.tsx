// app/blog/admin/DashboardContent.tsx
// FIX: Replaced manual loading/error/fetch pattern with useFetch hook.

"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { message } from "antd";

import { categoriesService } from "@/services/categories.service";
import { postsService } from "@/services/posts.service";
import { useFetch } from "@/hooks/useFetch";
import { formatError } from "@/utils/error";
import styles from "@/styles/dashboard.module.css";
import type { CategoryRow } from "@/types/category";
import type { PostRow } from "@/types/posts";

const Row       = dynamic(() => import("antd").then((m) => m.Row),       { ssr: false });
const Col       = dynamic(() => import("antd").then((m) => m.Col),       { ssr: false });
const Card      = dynamic(() => import("antd").then((m) => m.Card),      { ssr: false });
const Statistic = dynamic(() => import("antd").then((m) => m.Statistic), { ssr: false });
const Divider   = dynamic(() => import("antd").then((m) => m.Divider),   { ssr: false });
const Spin      = dynamic(() => import("antd").then((m) => m.Spin),      { ssr: false });

async function fetchDashboard() {
  const [catRes, postRes] = await Promise.all([
    categoriesService.getAll(),
    postsService.getAll(),
  ]);
  return {
    categories: catRes.data  as CategoryRow[],
    posts:      postRes.data as PostRow[],
  };
}

export default function DashboardContent() {
  const { data, loading, error } = useFetch(fetchDashboard);

  const categories = data?.categories ?? [];
  const posts      = data?.posts      ?? [];

  if (error) {
    message.error(formatError(error));
  }

  const categoryStats = useMemo(
    () => categories.map((cat) => ({
      ...cat,
      count: posts.filter(
        (p) => p?.category?.toLowerCase() === cat.name.toLowerCase()
      ).length,
    })),
    [categories, posts]
  );

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <>
      <Row gutter={[16, 16]} className={styles.grid}>
        {categoryStats.map((cat) => (
          <Col xs={24} sm={12} md={8} lg={6} key={cat.id}>
            <Card className={styles.card}>
              <Statistic
                title={<span className={styles.cardTitle}>{cat.name}</span>}
                value={cat.count}
                suffix={<span className={styles.cardTitle}>posts</span>}
                styles={{ content: { color: "#fff" } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider className={styles.divider} />

      <Row justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.totalCard}>
            <Statistic
              title={<span className={styles.cardTitle}>Total Posts</span>}
              value={posts.length}
              styles={{ content: { color: "#fff" } }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
