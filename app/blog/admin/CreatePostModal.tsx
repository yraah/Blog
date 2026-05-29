// app/blog/admin/CreatePostModal.tsx
// FIX: Replaced inline slugify with utils/text.ts slugify.
// FIX: Replaced inline uploadToCloudinary/createPostWithRetry with withRetry + uploadService.
// FIX: Uses PostRow type (PascalCase).

"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { message, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import type { PostFormValues, PostCreateBody } from "@/types/posts";
import { categoriesService } from "@/services/categories.service";
import { postsService } from "@/services/posts.service";
import { uploadService } from "@/services/upload.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { slugify } from "@/utils/text";
import { useFetch } from "@/hooks/useFetch";
import styles from "@/styles/post-form.module.css";

const Modal    = dynamic(() => import("antd").then((m) => m.Modal),           { ssr: false });
const Button   = dynamic(() => import("antd").then((m) => m.Button),          { ssr: false });
const Input    = dynamic(() => import("antd").then((m) => m.Input),           { ssr: false });
const Row      = dynamic(() => import("antd").then((m) => m.Row),             { ssr: false });
const Col      = dynamic(() => import("antd").then((m) => m.Col),             { ssr: false });
const Upload   = dynamic(() => import("antd").then((m) => m.Upload),          { ssr: false });
const Select   = dynamic(() => import("antd").then((m) => m.Select),          { ssr: false });
const Divider  = dynamic(() => import("antd").then((m) => m.Divider),         { ssr: false });
const TextArea = dynamic(() => import("antd").then((m) => m.Input.TextArea),  { ssr: false });
const Editor   = dynamic(() => import("react-simple-wysiwyg").then((m) => m.DefaultEditor), { ssr: false });

const FORM_DEFAULTS: PostFormValues = {
  title: "", description: "", category: "",
  meta_title: "", meta_description: "",
  alt_image_name: "", image: "", slug: "",
};

type Category = { id: number; name: string };

export default function CreatePostModal({ onSuccess }: { onSuccess: () => void }) {
  const [open,       setOpen]       = useState(false);
  const [imageUrl,   setImageUrl]   = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formInstance] = Form.useForm<PostFormValues>();

  // Use shared hook for categories
  const { data: categories } = useFetch<Category[]>(() =>
    categoriesService.getAll().then((r) => r.data)
  );

  const categoryOptions = useMemo(
    () => (categories ?? []).map((cat) => ({ label: cat.name, value: cat.name, key: cat.id })),
    [categories]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    formInstance.resetFields();
    setImageUrl("");
  }, [formInstance]);

  // FIX: Uses uploadService instead of inline fetch("/api/upload")
  const beforeUpload = useCallback(async (file: File) => {
    try {
      setUploading(true);
      const res = await withRetry(() => uploadService.uploadImage(file));
      setImageUrl(res.data.url);
      message.success("Image uploaded");
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setUploading(false);
    }
    return false;
  }, []);

  const handleRemove = useCallback(() => setImageUrl(""), []);

  const handleSubmit = useCallback(async (values: PostFormValues) => {
    if (!imageUrl) return message.error("Please upload an image first");

    try {
      setSubmitting(true);

      const payload: PostCreateBody = {
        title:            values.title,
        slug:             slugify(values.title),   // FIX: from utils/text.ts
        category:         values.category,
        description:      values.description,
        image:            imageUrl,
        meta_title:       values.meta_title,
        meta_description: values.meta_description,
        alt_image_name:   values.alt_image_name ?? "",
      };

      await withRetry(() => postsService.create(payload));

      message.success("Post created 🚀");
      handleClose();
      onSuccess?.();
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setSubmitting(false);
    }
  }, [imageUrl, handleClose, onSuccess]);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        + Create Post
      </Button>

      <Modal
        title="Create Post"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={1000}
      >
        <Form form={formInstance} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <h3 className={styles.sectionTitle}>Post Content</h3>

              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Editor onChange={(e) => formInstance.setFieldsValue({ title: e.target.value })} />
              </Form.Item>

              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select Category" options={categoryOptions} />
              </Form.Item>

              <Form.Item label="Image" required>
                <Upload maxCount={1} listType="picture" beforeUpload={beforeUpload} onRemove={handleRemove}>
                  <Button icon={<UploadOutlined />} loading={uploading}>Upload Image</Button>
                </Upload>
              </Form.Item>

              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Editor onChange={(e) => formInstance.setFieldsValue({ description: e.target.value })} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <h3 className={styles.sectionTitle}>SEO Meta Tags</h3>

              <Form.Item name="meta_title" label="Meta Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="alt_image_name" label="Alt Image Name">
                <Input />
              </Form.Item>

              <Form.Item name="meta_description" label="Meta Description" rules={[{ required: true }]}>
                <TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div className={styles.footer}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={uploading}>
              Create Post
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
