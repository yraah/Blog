// app/blog/admin/EditPostModal.tsx
// FIX: Replaced inline uploadImage/updatePostWithRetry with withRetry + uploadService.
// FIX: Uses PostRowWithId type (PascalCase, renamed from postRowId).
// FIX: Uses useFetch hook for categories.

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { message, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";

import { categoriesService } from "@/services/categories.service";
import { postsService } from "@/services/posts.service";
import { uploadService } from "@/services/upload.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";
import { useFetch } from "@/hooks/useFetch";

import type { CategoryRow } from "@/types/category";
import type { PostRowWithId, PostBody } from "@/types/posts";
import styles from "@/styles/post-form.module.css";

const Modal    = dynamic(() => import("antd").then((m) => m.Modal),           { ssr: false });
const Input    = dynamic(() => import("antd").then((m) => m.Input),           { ssr: false });
const TextArea = dynamic(() => import("antd").then((m) => m.Input.TextArea),  { ssr: false });
const Upload   = dynamic(() => import("antd").then((m) => m.Upload),          { ssr: false });
const Button   = dynamic(() => import("antd").then((m) => m.Button),          { ssr: false });
const Row      = dynamic(() => import("antd").then((m) => m.Row),             { ssr: false });
const Col      = dynamic(() => import("antd").then((m) => m.Col),             { ssr: false });
const Select   = dynamic(() => import("antd").then((m) => m.Select),          { ssr: false });
const Editor   = dynamic(() => import("react-simple-wysiwyg").then((m) => m.DefaultEditor), { ssr: false });

type EditPostModalProps = {
  post:      PostRowWithId;
  onClose:   () => void;
  onSuccess: () => void;
};

export default function EditPostModal({ post, onClose, onSuccess }: EditPostModalProps) {
  const [uploading,  setUploading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl,   setImageUrl]   = useState<string>(post?.image ?? "");

  const [form] = Form.useForm<PostRowWithId>();

  const title       = Form.useWatch("title",       form);
  const description = Form.useWatch("description", form);

  // FIX: useFetch replaces manual fetch + retry ref pattern
  const { data: categoriesData } = useFetch<CategoryRow[]>(() =>
    categoriesService.getAll().then((r) => r.data)
  );

  const categoryOptions = useMemo(
    () => (categoriesData ?? []).map((cat) => ({ label: cat.name, value: cat.name, key: cat.id })),
    [categoriesData]
  );

  // Populate form on open
  useEffect(() => {
    if (!post) return;
    console.log(post)
    form.setFieldsValue({
      title:            post.title,
      category:         post.category,
      description:      post.description,
      meta_title:       post.meta_title,
      meta_description: post.meta_description,
      alt_image_name:   post.alt_image_name,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(post.image ?? "");
  }, [post, form]);

  // FIX: Uses uploadService instead of inline fetch
  const handleUpload = useCallback(async ({
    file,
    onSuccess: uploadSuccess,
    onError:   uploadError,
  }: {
    file:        File;
    onSuccess?:  (res: object) => void;
    onError?:    (err: Error) => void;
  }) => {
    try {
      setUploading(true);
      const res = await withRetry(() => uploadService.uploadImage(file));
      setImageUrl(res.data.url);
      message.success("Image uploaded");
      uploadSuccess?.({ url: res.data.url });
    } catch (error) {
      message.error(formatError(error));
      uploadError?.(error as Error);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (uploading) return message.warning("Please wait for image upload");

    try {
      const values = await form.validateFields();
      if (!imageUrl) return message.error("Please upload image first");

      setSubmitting(true);

      await withRetry(() =>
        postsService.update(post.id, {
          ...values,
          image:          imageUrl,
          alt_image_name: values.alt_image_name ?? "",
        } as PostBody)
      );

      message.success("Post updated 🎉");
      onSuccess();
      onClose();
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setSubmitting(false);
    }
  }, [uploading, imageUrl, form, post.id, onSuccess, onClose]);

  return (
    <Modal
      title="Edit Post"
      open={true}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Update"
      confirmLoading={submitting}
      width={900}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <h3 className={styles.sectionTitle}>Post Content</h3>

            <Form.Item label="Title" name="title">
              <Editor
                value={title || ""}
                onChange={(e) => form.setFieldsValue({ title: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Category" name="category">
              <Select options={categoryOptions} />
            </Form.Item>

            <Form.Item label="Featured Image">
              <Upload maxCount={1} showUploadList={false} customRequest={handleUpload as never}>
                <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Upload>

              {imageUrl && (
                <div className={styles.imagePreviewWrapper}>
                  <Image
                    src={imageUrl}
                    alt="preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Editor
                value={description || ""}
                onChange={(e) => form.setFieldsValue({ description: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <h3 className={styles.sectionTitle}>SEO Settings</h3>

            <Form.Item label="Meta Title" name="meta_title" > <Input value={post.meta_title}/> </Form.Item>
            <Form.Item label="Alt Image Text"   name="alt_image_name">   <Input value={post.alt_image_name}/>           </Form.Item>
            <Form.Item label="Meta Description" name="meta_description"> <TextArea rows={5} value={post.meta_description}/></Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
