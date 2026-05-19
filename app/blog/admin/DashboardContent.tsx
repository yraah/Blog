"use client";

import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, Divider } from "antd";
type Category = {
  id: number;
  name: string;

};

type PostForm = {
  title: string;
  category: string
  description: string;
};

export default function DashboardContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<PostForm[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, postRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/posts"),
        ]);

        const catData = await catRes.json();
        const postData = await postRes.json();

        setCategories(Array.isArray(catData) ? catData : []);
        setPosts(Array.isArray(postData) ? postData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 TOTAL POSTS
  const totalPosts = posts.length;

  if (loading) {
    return <Spin style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <>
      {/* 📊 CATEGORY STATS */}
      <Row gutter={[16, 16]}>
        {categories.map((cat) => {
          const count = posts.filter(
            (p) =>
              p?.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={cat.id}>
              <Card
                style={{
                  backgroundColor: "#A367B1",
                  borderRadius: 12,
                  transition: "0.3s",
                  boxShadow: "0 0 10px rgba(255,255,255,0.1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(255,255,255,0.1)";
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: "#fff" }}>
                      {cat.name}
                    </span>
                  }
                  value={count}
                  suffix={
                    <span style={{ color: "#fff" }}>posts</span>
                  }
                  styles={{
                    content: {
                      color: "#fff"
                    },
                  }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 🔥 DIVIDER */}
      <Divider
        style={{
          borderColor: "#8c8c8c",
          margin: "30px 0",
        }}
      />

      {/* 🔥 TOTAL POSTS */}
      <Row justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              backgroundColor: "#A367B1",
              borderRadius: 12,
              boxShadow: "0 0 15px rgba(168,85,247,0.4)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff" }}>
                  Total Posts
                </span>
              }
              value={totalPosts}
              styles={{
                content: {
                  color: "#fff"
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}