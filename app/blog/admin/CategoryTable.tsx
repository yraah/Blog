// app/blog/admin/CategoryTable.tsx
// FIX: Replaced inline retry logic with shared withRetry util.
// FIX: Uses PAGINATION constant instead of hardcoded pageSize: 5.

"use client";

import { useState, Suspense, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { TableProps } from "antd";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { categoriesService } from "@/services/categories.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { PAGINATION } from "@/lib/constants";
import { useFetch } from "@/hooks/useFetch";
import tableStyles from "@/styles/table.module.css";
import type { CategoryRow } from "@/types/category";

// --- Skeletons ---
function TableSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ height: 48, background: "#f0f0f0", borderRadius: 6 }} />
      {[72, 72, 72, 72, 72].map((h, i) => (
        <div key={i} style={{ height: h, background: "#fafafa", borderRadius: 6, border: "1px solid #f0f0f0" }} />
      ))}
    </div>
  );
}

// --- Dynamic imports ---
const CreateCategoryModal = dynamic(() => import("./CreateCategoryModal"), { ssr: false });
const AntTable     = dynamic(() => import("antd").then((m) => m.Table),        { loading: () => <TableSkeleton />, ssr: false }) as React.ComponentType<TableProps<CategoryRow>>;
const AntInputSearch = dynamic(() => import("antd").then((m) => m.Input.Search), { ssr: false });
const Popconfirm   = dynamic(() => import("antd").then((m) => m.Popconfirm),   { ssr: false });
const Button       = dynamic(() => import("antd").then((m) => m.Button),       { ssr: false });
const Divider      = dynamic(() => import("antd").then((m) => m.Divider),      { ssr: false });

// Stable renderer — not recreated on render
function IconCell(icon?: string | null) {
  return icon ? (
    <div style={{ width: 40, height: 40, position: "relative" }}>
      <Image src={icon} alt="category-icon" fill sizes="40px" style={{ objectFit: "cover", borderRadius: 6 }} />
    </div>
  ) : (
    <span>No Icon</span>
  );
}

export default function CategoryTable() {
  const [searchValue, setSearchValue] = useState("");
  const [deleting, setDeleting]       = useState(false);

  const {
    data: categories,
    loading,
    refetch,
  } = useFetch<CategoryRow[]>(() =>
    categoriesService.getAll().then((r) => r.data)
  );

  const handleDelete = useCallback(async (id: number) => {
    try {
      setDeleting(true);
      await withRetry(() => categoriesService.remove(id));
      message.success("Category deleted");
      refetch();
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setDeleting(false);
    }
  }, [refetch]);

  const filteredCategories = useMemo(
    () => (categories ?? []).filter((cat) =>
      cat.name.toLowerCase().includes(searchValue.toLowerCase())
    ),
    [categories, searchValue]
  );

  const columns: ColumnsType<CategoryRow> = useMemo(() => [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: IconCell,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
          <Button danger loading={deleting}>Delete</Button>
        </Popconfirm>
      ),
    },
  ], [handleDelete, deleting]);

  return (
    <div className={tableStyles.wrapper}>
      <Suspense fallback={null}>
        <div className={tableStyles.section}>
          <CreateCategoryModal onSuccess={refetch} />
        </div>

        <Divider className={tableStyles.divider} />

        <div className={tableStyles.section}>
          <AntInputSearch
            placeholder="Search category..."
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={tableStyles.searchBox}
          />
        </div>
      </Suspense>

      <AntTable
        className="custom-table"
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: PAGINATION.defaultPageSize }}
      />
    </div>
  );
}
