"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function Editor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // ✅ saves HTML
    },
  });

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
      {/* TOOLBAR */}
      <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button onClick={() => {
          const url = prompt("Enter URL");
          editor.chain().focus().setLink({ href: url }).run();
        }}>
          Link
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} style={{ padding: 10, minHeight: 200 }} />
    </div>
  );
}