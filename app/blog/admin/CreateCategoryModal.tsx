// app/blog/admin/CreateCategoryModal.tsx
// FIX: Replaced inline createCategoryWithRetry with shared withRetry util.

"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { message } from "antd";
import type { RcFile } from "antd/es/upload";
import Image from "next/image";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoriesService } from "@/services/categories.service";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";

const Modal          = dynamic(() => import("antd").then((m) => m.Modal),          { ssr: false });
const Button         = dynamic(() => import("antd").then((m) => m.Button),         { ssr: false });
const Input          = dynamic(() => import("antd").then((m) => m.Input),          { ssr: false });
const Upload         = dynamic(() => import("antd").then((m) => m.Upload),         { ssr: false });
const UploadOutlined = dynamic(() => import("@ant-design/icons").then((m) => m.UploadOutlined), { ssr: false });

// Stable schema outside component
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Stable util outside component
const convertToBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject("Failed to read file");
  });

const FORM_DEFAULTS: CategoryFormValues = { name: "" };

export default function CreateCategoryModal({ onSuccess }: { onSuccess: () => void }) {
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [iconFile, setIconFile] = useState<RcFile | null>(null);

  const previewUrl = useMemo(
    () => (iconFile ? URL.createObjectURL(iconFile) : null),
    [iconFile]
  );

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver:      zodResolver(categorySchema),
    defaultValues: FORM_DEFAULTS,
  });

  const handleClose = useCallback(() => {
    setOpen(false);
    reset();
    setIconFile(null);
  }, [reset]);

  const onSubmit = useCallback(async (values: CategoryFormValues) => {
    try {
      setLoading(true);

      let iconBase64: string | undefined;
      if (iconFile) {
        message.loading("Uploading image...", 0.5);
        iconBase64 = await convertToBase64(iconFile);
      }

      // FIX: withRetry from utils instead of inline createCategoryWithRetry
      await withRetry(() =>
        categoriesService.create({ name: values.name, icon: iconBase64 })
      );

      message.success("Category created 🎉");
      handleClose();
      onSuccess();
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setLoading(false);
    }
  }, [iconFile, handleClose, onSuccess]);

  const beforeUpload = useCallback((file: RcFile) => {
    setIconFile(file);
    return false;
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        + Add Category
      </Button>

      <Modal
        title="Create Category"
        open={open}
        onCancel={handleClose}
        onOk={handleSubmit(onSubmit)}
        okText="Create"
        confirmLoading={loading}
      >
        <div style={{ marginBottom: 12 }}>
          <label>Category Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. Slots, Live Casino" />
            )}
          />
          {errors.name && (
            <p style={{ color: "red", marginTop: 5 }}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label>Category Icon</label>
          <Upload beforeUpload={beforeUpload} maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>Upload Icon</Button>
          </Upload>

          {previewUrl && (
            <Image
              src={previewUrl}
              alt="preview"
              width={50}
              height={50}
              style={{ marginTop: 10, borderRadius: 8, objectFit: "cover" }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
