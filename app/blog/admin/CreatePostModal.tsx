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

export default function CreatePostModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
const [categories, setCategories] = useState<Category[]>([]);
  const [formInstance] = Form.useForm();

const [form, setForm] = useState<PostForm>({
  title: "",
  description: "",
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

  // 📌 convert image
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

  const uploadProps = {
    beforeUpload: (file : File) => {
      setImageFile(file);
      return false;
    },
    maxCount: 1,
    onRemove: () => setImageFile(null),
  };

  // 📌 SUBMIT (VALIDATED)
  const handleSubmit = async (values : any) => {
    let imageBase64 = "";

    if (imageFile) {
      imageBase64 = await convertToBase64(imageFile);
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        image: imageBase64,
      }),
    });

    if (res.ok) {
      formInstance.resetFields();
      setForm({
    title: "",
    description: "",
  });
      setImageFile(null);
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
        <Form
          form={formInstance}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            {/* LEFT */}
            <Col span={12}>
              <h3>Post Content</h3>

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

                    formInstance.setFieldsValue({
                      title: value,
                    });
                  }}
                  containerProps={{
                    style: {
                      minHeight: "80px", // smaller than description
                    },
                  }}
                />
              </Form.Item>




              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select placeholder="Select Category">
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.name}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
  label="Image"
  name="image"
  valuePropName="fileList"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  }}
  rules={[
    {
      required: true,
      message: "Image is required",
    },
  ]}
>
  <Upload
    beforeUpload={(file : File) => {
      setImageFile(file); // still needed for base64
      return false;
    }}
    maxCount={1}
    listType="picture"
  >
    <Button icon={<UploadOutlined />}>Upload Image</Button>
  </Upload>
</Form.Item>



              {/* ✅ EDITOR FIXED */}
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

                    // update local
                   setForm({
    title: "",
    description: "",
  });

                    // update form (IMPORTANT)
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

            {/* RIGHT */}
            <Col span={12}>
              <h3>SEO Meta Tags</h3>

              <Form.Item
                label="Meta Title"
                name="meta_title"
                rules={[
                  { required: true, message: "Meta title is required" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* OPTIONAL */}
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

            {/* ✅ VALIDATED SUBMIT */}
            <Button type="primary" htmlType="submit">
              Create Post
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}