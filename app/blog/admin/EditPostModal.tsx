"use client";

import { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, message, Row, Col, Select } from "antd";
import type { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { Form } from "antd";
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
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditPostModal({
  post,
  onClose,
  onSuccess,
}: EditPostModalProps) {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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
      formInstance.setFieldsValue(data); // 🔥 sync with antd form
    }
  }, [post]);

  // 📌 BASE64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => reject(error);
    });
  };

 const handleSubmit = async () => {
  try {
    await formInstance.validateFields(); // 🔥 validation

    let base64Image = form.image;

    if (imageFile) {
      base64Image = await convertToBase64(imageFile);
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: base64Image,
      }),
    });

    if (res.ok) {
      message.success("Post updated successfully 🎉");
      onClose();
      onSuccess?.();
    } else {
      message.error("Failed to update post");
    }
  } catch (err) {
    // validation error
  }
};

  if (!post) return null;

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

          {/* LEFT SIDE */}
          <Col span={14}>
            <h3>Post Content</h3>

            {/* TITLE */}
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value === "<p><br></p>") {
                      return Promise.reject("Title is required");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Editor
                value={form.title || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev) => ({ ...prev, title: value }));

                  formInstance.setFieldsValue({ title: value });
                }}
                containerProps={{
                  style: { minHeight: "80px" },
                }}
              />
            </Form.Item>

            {/* CATEGORY */}
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Select category" }]}
            >
              <Select
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, category: value }));
                }}
              >
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.name}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* IMAGE */}
            <Form.Item label="Featured Image">
              <Upload
                beforeUpload={(file) => {
                  setImageFile(file);
                  return false;
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>

              {(imageFile || form.image) && (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                  alt="preview"
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
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value === "<p><br></p>") {
                      return Promise.reject("Description is required");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Editor
                value={form.description || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev) => ({ ...prev, description: value }));

                  formInstance.setFieldsValue({
                    description: value,
                  });
                }}
                containerProps={{
                  style: { minHeight: "200px" },
                }}
              />
            </Form.Item>
          </Col>

          {/* RIGHT SIDE */}
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

            {/* SEO PREVIEW */}
            <div style={{ marginTop: 10, padding: 10, background: "#fafafa", borderRadius: 8 }}>
              <small style={{ color: "#888" }}>Preview</small>
              <div style={{ fontWeight: 600 }}>
                {form.meta_title || form.title || "Post title"}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {form.meta_description || "Meta description will appear here..."}
              </div>
            </div>
          </Col>

        </Row>
      </Form>
    </Modal>
  );
}