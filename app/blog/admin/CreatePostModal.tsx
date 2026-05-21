"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Select,
  Form,
  Divider,
} from "antd";
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

type PostForm = {
  title: string;
  description: string;
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/&[^;]+;/g, "") // remove entities
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function CreatePostModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formInstance] = Form.useForm();

  const [form, setForm] = useState<PostForm>({
    title: "",
    description: "",
  });

  // ✅ CLOUDINARY IMAGE URL
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

  // 📌 CLOUDINARY UPLOAD HANDLER (used inside Upload)
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data?.url) {
      setImageUrl(data.url);
    }
  };

const handleSubmit = async (values: any) => {
  const generatedSlug = slugify(values.title);

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...values,
      slug: generatedSlug, // 🔥 ADD THIS
      image: imageUrl,
    }),
  });
   console.log("VALUES FROM FORM:", values);
console.log("IMAGE URL STATE:", imageUrl);

  if (res.ok) {
    formInstance.resetFields();

    setForm({
      title: "",
      description: "",
    });

    setImageUrl("");
    setOpen(false);
    onSuccess?.();
  }
};

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        + Create Post
      </Button>

      <Modal
        title="Create Post"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
      >
        <Form form={formInstance} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            {/* LEFT SIDE */}
            <Col span={12}>
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
                  value={form.title}
                  onChange={(e) => {
                    const value = e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      title: value,
                    }));

                    formInstance.setFieldsValue({
                      title: value,
                    });
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
                rules={[
                  { required: true, message: "Category is required" },
                ]}
              >
                <Select placeholder="Select Category">
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.name}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* IMAGE UPLOAD */}
              <Form.Item
                label="Image"
                name="image"
                rules={[
                  { required: true, message: "Image is required" },
                ]}
              >
                <Upload
                  maxCount={1}
                  listType="picture"
                  beforeUpload={(file) => {
                    uploadToCloudinary(file);
                    return false; // prevent default upload
                  }}
                  onRemove={() => setImageUrl("")}
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Image
                  </Button>
                </Upload>
              </Form.Item>

              {/* DESCRIPTION */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value === "<p><br></p>") {
                        return Promise.reject(
                          "Description is required"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Editor
                  value={form.description}
                  onChange={(e) => {
                    const value = e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      description: value,
                    }));

                    formInstance.setFieldsValue({
                      description: value,
                    });
                  }}
                  containerProps={{
                    style: { minHeight: "300px" },
                  }}
                />
              </Form.Item>
            </Col>

            {/* RIGHT SIDE */}
            <Col span={12}>
              <h3>SEO Meta Tags</h3>

              <Form.Item
                label="Meta Title"
                name="meta_title"
                rules={[
                  {
                    required: true,
                    message: "Meta title is required",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Alt Image Name" name="alt_image_name">
                <Input placeholder="Optional SEO alt text" />
              </Form.Item>

              <Form.Item
                label="Meta Description"
                name="meta_description"
                rules={[
                  {
                    required: true,
                    message: "Meta description is required",
                  },
                ]}
              >
                <Input.TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setOpen(false)}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>

            <Button type="primary" htmlType="submit">
              Create Post
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}