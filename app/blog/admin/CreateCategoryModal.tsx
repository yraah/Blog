"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import type { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, } from "antd";

type Category = {
  id: number;
  name: string;
  icon?: string;
};

export default function CategorySection({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconFile, setIconFile] = useState<RcFile | null>(null);

  const [form] = Form.useForm();

  // 🔥 SUBMIT
 const handleSubmit = async () => {
  try {
    const values = await form.validateFields();

    let iconBase64 = values.icon;

    if (iconFile) {
      iconBase64 = await convertToBase64(iconFile);
    }

    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        icon: iconBase64,
      }),
    });

    if (res.ok) {
      message.success("Category created 🎉");
      form.resetFields();
      setIconFile(null);
      setOpen(false);
      onSuccess();
    } else {
      message.error("Failed to create category");
    }
  } catch (err) {
    // validation error
  } finally {
    setLoading(false);
  }
};

  const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

  return (
    <div>

      {/* 🔘 BUTTON */}
      <Button
        type="primary"
        onClick={() => setOpen(true)}
      >
        + Add Category
      </Button>


      {/* 🪟 MODAL */}
      <Modal
        title="Create Category"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Create"
        confirmLoading={loading}
      >

        <Form form={form} layout="vertical">

          {/* NAME */}
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Enter category name" }]}
          >
            <Input placeholder="e.g. Slots, Live Casino" />
          </Form.Item>

          {/* ICON */}
          <Form.Item label="Category Icon">

  <Upload
    beforeUpload={(file) => {
      setIconFile(file);
      return false;
    }}
    maxCount={1}
    accept="image/*"
  >
    <Button icon={<UploadOutlined />}>
      Upload Icon
    </Button>
  </Upload>

  {iconFile && (
    <img
      src={URL.createObjectURL(iconFile)}
      style={{
        width: 50,
        height: 50,
        marginTop: 10,
        borderRadius: 8,
        objectFit: "cover",
      }}
    />
  )}

</Form.Item>
        </Form>

      </Modal>
    </div>
  );
}