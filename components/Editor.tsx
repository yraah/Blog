"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function Editor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ✅ sync external value (IMPORTANT for edit mode)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Enter URL");

    if (!url) return; // ✅ prevent null

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
      {/* TOOLBAR */}
      <div style={{ padding: 10, borderBottom: "1px solid #ccc", display: "flex", gap: 8 }}>
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{ fontWeight: editor.isActive("bold") ? "bold" : "normal" }}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ fontStyle: editor.isActive("italic") ? "italic" : "normal" }}
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          style={{
            background: editor.isActive("heading", { level: 2 })
              ? "#ddd"
              : "transparent",
          }}
        >
          H2
        </button>

        <button onClick={setLink}>Link</button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        style={{ padding: 10, minHeight: 200 }}
      />
    </div>
  );
}