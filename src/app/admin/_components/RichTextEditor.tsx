"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const formats = ["header", "bold", "italic", "underline", "list", "link"];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="rich-text-editor overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(nextValue) => onChange(nextValue === "<p><br></p>" ? "" : nextValue)}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
