"use client";

import { useEffect, useState } from "react";
import { Table, Button, Space, Divider, Input, Image } from "antd";
import CreateCategoryModal from "./CreateCategoryModal";
import "@/styles/table.css";





export default function CategoryTable() {

  type Category = {
    id: number;
    name: string;
  };

  const [data, setData] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState("");


  // 🔄 GET CATEGORIES API
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    setData(json);
  };

  // initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // 🗑 delete category
  const handleDelete = async (id: number) => {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  };

  // 🔍 SEARCH FILTER
  const filteredData = data.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      render: (icon: any) =>
        icon ? <Image src={icon} width={40} /> : "No Icon",
    },
    {
      title: "Category Name",
      dataIndex: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* 🔥 CREATE CATEGORY */}
      <div style={{ marginBottom: 16 }}>
        <CreateCategoryModal onSuccess={fetchCategories} />
      </div>

      <Divider />

      {/* 🔍 SEARCH */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search category..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* 📊 TABLE */}
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </>
  );


}

