"use client";

import { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, message, Row, Col, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-simple-wysiwyg").then((mod) => mod.DefaultEditor),
  { ssr: false }
);

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  meta_title: string;
  meta_description: string;
  alt_image_name: string;
};

type EditPostModalProps = {
  post: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditPostModal({
  post,
  onClose,
  onSuccess,
}: EditPostModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formInstance] = Form.useForm();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    meta_title: "",
    meta_description: "",
    alt_image_name: "",
  });

  const [imageUrl, setImageUrl] = useState<string>("");

  // 📌 FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    };

    fetchCategories();
  }, []);

  // 📌 LOAD POST DATA
  useEffect(() => {
    if (post) {
      const data = {
        title: post.title,
        category: post.category,
        description: post.description,
        image: post.image,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        alt_image_name: post.alt_image_name || "",
      };

      setForm(data);
      setImageUrl(post.image || "");
      formInstance.setFieldsValue(data);
    }
  }, [post]);

const handleSubmit = async () => {
  if (uploading) {
    message.warning("Please wait for image upload to finish");
    return;
  }

  if (!imageUrl) {
    message.error("Please upload image first");
    return;
  }

  console.log("HANDLE SUBMIT IMAGE URL:", imageUrl);

  await formInstance.validateFields();

  const res = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      image: imageUrl,
    }),
  });

  if (res.ok) {
    message.success("Post updated successfully 🎉");
    onClose();
    onSuccess?.();
  }
};

  return (
    <Modal
      title="Edit Post"
      open={true}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Update"
      width={900}
    >
      <Form form={formInstance} layout="vertical">
        <Row gutter={[16, 16]}>

          {/* LEFT */}
          <Col span={14}>
            <h3>Post Content</h3>

            {/* TITLE */}
            <Form.Item label="Title" name="title">
              <Editor
                value={form.title}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({ ...prev, title: value }));
                  formInstance.setFieldsValue({ title: value });
                }}
              />
            </Form.Item>

            {/* CATEGORY */}
            <Form.Item label="Category" name="category">
              <Select
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, category: value }))
                }
              >
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.name}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* IMAGE UPLOAD */}
            <Form.Item label="Featured Image">
          <Upload
  maxCount={1}
  showUploadList={false}
  customRequest={async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true); // ✅ START LOADING

      const formData = new FormData();
      formData.append("file", file as File);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (data?.url) {
        setImageUrl(data.url);
        message.success("Image uploaded");
        onSuccess?.(data);
      } else {
        message.error("Upload failed");
        onError?.(new Error("No URL"));
      }
    } catch (err) {
      console.error(err);
      onError?.(err as Error);
    } finally {
      setUploading(false); // ✅ STOP LOADING
    }
  }}
>
  <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
    {uploading ? "Please wait, uploading..." : "Upload Image"}
  </Button>
</Upload>

              {imageUrl && (
                <img
                  src={imageUrl}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 8,
                    maxHeight: 200,
                    objectFit: "cover",
                  }}
                />
              )}
            </Form.Item>

            {/* DESCRIPTION */}
            <Form.Item label="Description" name="description">
              <Editor
                value={form.description}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({ ...prev, description: value }));
                  formInstance.setFieldsValue({ description: value });
                }}
              />
            </Form.Item>
          </Col>

          {/* RIGHT */}
          <Col span={10}>
            <h3>SEO Settings</h3>

            <Form.Item label="Meta Title" name="meta_title">
              <Input
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    meta_title: e.target.value,
                  }))
                }
              />
            </Form.Item>

            <Form.Item label="Alt Image Text" name="alt_image_name">
              <Input
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    alt_image_name: e.target.value,
                  }))
                }
              />
            </Form.Item>

            <Form.Item label="Meta Description" name="meta_description">
              <Input.TextArea
                rows={5}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    meta_description: e.target.value,
                  }))
                }
              />
            </Form.Item>

            {/* PREVIEW */}
            <div
              style={{
                marginTop: 10,
                padding: 10,
                background: "#fafafa",
                borderRadius: 8,
              }}
            >
              <small style={{ color: "#888" }}>Preview</small>
              <div style={{ fontWeight: 600 }}>
                {form.meta_title || form.title || "Post title"}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {form.meta_description ||
                  "Meta description will appear here..."}
              </div>
            </div>
          </Col>

        </Row>
      </Form>
    </Modal>
  );
}