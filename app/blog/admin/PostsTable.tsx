// app/blog/admin/PostsTable.tsx
// FIX: Replaced inline retry logic with withRetry util.
// FIX: Replaced inline cleanText/truncate with utils/text.ts.
// FIX: Uses PAGINATION constant instead of hardcoded pageSize: 5.
// FIX: Uses useFetch hook instead of manual loading/error state.

"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";

import CreatePostModal from "./CreatePostModal";
import EditPostModal from "./EditPostModal";

import { postsService } from "@/services/posts.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { cleanText, truncate } from "@/utils/text";
import { useFetch } from "@/hooks/useFetch";
import { PAGINATION } from "@/lib/constants";
import type { PostRow } from "@/types/posts";
import styles from "@/styles/posts-table.module.css";

const Table       = dynamic(() => import("antd").then((m) => m.Table),           { ssr: false }) as React.ComponentType<TableProps<PostRow>>;
const AntImage    = dynamic(() => import("antd").then((m) => m.Image),           { ssr: false });
const Space       = dynamic(() => import("antd").then((m) => m.Space),           { ssr: false });
const Divider     = dynamic(() => import("antd").then((m) => m.Divider),         { ssr: false });
const InputSearch = dynamic(() => import("antd").then((m) => m.Input.Search),    { ssr: false });
const Popconfirm  = dynamic(() => import("antd").then((m) => m.Popconfirm),      { ssr: false });

// Stable util — not recreated on render
const isValidImage = (img?: string): boolean => {
  if (!img) return false;
  if (img.startsWith("data:image")) return false;
  return img.startsWith("http") || img.startsWith("/");
};

export default function PostsTable() {
  const [selectedPost, setSelectedPost] = useState<PostRow | null>(null);
  const [searchText,   setSearchText]   = useState("");

  const { data, loading, refetch } = useFetch<PostRow[]>(() =>
    postsService.getAll().then((r) => r.data)
  );

  const posts = data ?? [];

  const handleDelete = useCallback(async (id: number) => {
    try {
      await withRetry(() => postsService.remove(id));
      message.success("Deleted successfully");
      refetch();
    } catch (error) {
      message.error(formatError(error));
    }
  }, [refetch]);

  const filteredData = useMemo(
    () => posts.filter((post) =>
      post.title?.toLowerCase().includes(searchText.toLowerCase())
    ),
    [posts, searchText]
  );

  const columns = useMemo(() => [
    {
      title:     "Title",
      dataIndex: "title",
      ellipsis:  true,
      render:    (text: string) => truncate(cleanText(text), 60),
    },
    {
      title:     "Category",
      dataIndex: "category",
    },
    {
      title:     "Description",
      dataIndex: "description",
      ellipsis:  true,
      render:    (text: string) => truncate(cleanText(text), 100),
    },
    {
      title:     "Image",
      dataIndex: "image",
      render:    (image?: string) =>
        isValidImage(image) ? (
          <AntImage src={image} width={60} height={60} className={styles.image} alt="post-image" />
        ) : "No Image",
    },
    {
      title: "Action",
      key:   "action",
      render: (_: unknown, record: PostRow) => (
        <Space size="middle">
          <EditOutlined
            className={styles.editIcon}
            onClick={() => setSelectedPost(record)}
          />
          <Popconfirm
            title="Delete this post?"
            description="Are you sure you want to delete this data?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className={styles.deleteIcon} />
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleDelete]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionsTop}>
        <CreatePostModal onSuccess={refetch} />
      </div>

      <Divider className={styles.divider} />

      <InputSearch
        placeholder="Search post title..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.search}
      />

      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: PAGINATION.defaultPageSize }}
      />

      {selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
