"use client";

import { useState, useEffect } from "react";
import { Table, Button, Image, Space, Divider, Input } from "antd";
import CreatePostModal from "./CreatePostModal";
import EditPostModal from "./EditPostModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm, message } from "antd";
import "@/styles/table.css";

type Post = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function PostsTable() {
  const [data, setData] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchText, setSearchText] = useState("");

  // 🔄 GET POSTS API
  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const json = await res.json();
    setData(json);
  };

  // initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  const cleanText = (html: string) => {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

  // 🗑 DELETE
  const handleDelete = async (id: number) => {
  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      message.success("Deleted successfully");
      // reload your data here
    } else {
      message.error("Failed to delete");
    }
  } catch (err) {
    message.error("Something went wrong");
  }
};

  const refresh = async () => {
    const res = await fetch("/api/posts");
    const json = await res.json();
    setData(json);
  };

  // 🔍 SEARCH FILTER
  const filteredData = data.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
{
  title: "Title",
  dataIndex: "title",
  ellipsis: true,
  render: (text: string) => {
    if (!text) return "-";

    const clean = cleanText(text);

    return clean.length > 60
      ? clean.slice(0, 60) + "..."
      : clean;
  },
},
    {
      title: "Category",
      dataIndex: "category",
    },

    // 🆕 NEW COLUMN
    {
      title: "Meta Title",
      dataIndex: "meta_title",
      ellipsis: true,
    },

    // 🆕 NEW COLUMN
    {
      title: "Meta Description",
      dataIndex: "meta_description",
      ellipsis: true,
    },

   {
  title: "Description",
  dataIndex: "description",
  ellipsis: true,
  render: (text: string) => {
    if (!text) return "-";

    const clean = cleanText(text);

    return clean.length > 100
      ? clean.slice(0, 100) + "..."
      : clean;
  },
},
    {
      title: "Alt Image",
      dataIndex: "alt_image_name",
      key: "alt_image_name",
      render: (text: string) => text || "-",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image: any) =>
        image ? <Image src={image} width={60} /> : "No Image",
    },
    {
  title: "Action",
  key: "action",
  
  render: (_: any, record: any) => (
    <Space size="middle">

      {/* EDIT ICON */}
      <EditOutlined
        style={{ color: "#1890ff", cursor: "pointer" }}
        onClick={() => setSelectedPost(record)}
      />

      {/* DELETE ICON WITH CONFIRM */}
      <Popconfirm
        title="Delete this post?"
        description="Are you sure you want to delete this data?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => handleDelete(record.id)}
        onCancel={() => message.info("Cancelled")}
      >
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
        />
      </Popconfirm>

    </Space>
  ),
}
  ];
  return (
    <>
      {/* CREATE */}
      <div style={{ marginBottom: 16 }}>
        <CreatePostModal onSuccess={fetchPosts} />
      </div>

      <Divider />

      {/* SEARCH */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search post title..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* TABLE */}
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* EDIT MODAL */}
      {selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSuccess={refresh}
        />
      )}
    </>
  );
}