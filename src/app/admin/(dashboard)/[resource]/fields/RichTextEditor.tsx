"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link2, Link2Off,
  List, ListOrdered, Quote, Minus, ImageIcon, Table as TableIcon, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, RemoveFormatting, SquareCode, Eye, Type,
} from "lucide-react";
import { markdownToHtml, htmlToMarkdown, wordCount } from "@/lib/markdown";

/* ------------------------------------------------------------- toolbar bits */

function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep the selection
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-accent-violet/15 text-accent-violet"
          : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.07]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-border mx-1 shrink-0" aria-hidden="true" />;
}

const BLOCKS = [
  { label: "Normal text", level: 0 },
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
  { label: "Heading 4", level: 4 },
] as const;

function BlockSelect({ editor }: { editor: Editor }) {
  const current =
    BLOCKS.find((b) => b.level > 0 && editor.isActive("heading", { level: b.level }))?.level ?? 0;

  return (
    <select
      value={current}
      onChange={(e) => {
        const level = Number(e.target.value);
        if (level === 0) editor.chain().focus().setParagraph().run();
        else editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
      }}
      title="Paragraph style"
      aria-label="Paragraph style"
      className="h-8 rounded-md border border-border bg-background/70 px-2 text-xs font-medium text-foreground/80 focus:outline-none focus:border-accent-violet cursor-pointer shrink-0"
    >
      {BLOCKS.map((b) => (
        <option key={b.level} value={b.level}>{b.label}</option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------ editor */

export function RichTextEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
}) {
  const [mode, setMode] = useState<"visual" | "markdown">("visual");

  // Derived, not stored — the parent already holds the markdown.
  const count = wordCount(value);

  // Guards the editor against re-seeding itself from the markdown it just emitted.
  const emitting = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your article…" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: markdownToHtml(value),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[26rem] px-5 py-4 focus:outline-none " +
          "prose-headings:font-bold prose-headings:tracking-tight " +
          "prose-a:text-accent-violet prose-code:text-accent-coral " +
          "prose-pre:bg-foreground/[0.06] prose-pre:text-foreground " +
          "prose-blockquote:border-l-accent-violet prose-img:rounded-xl " +
          "prose-table:text-sm prose-th:bg-foreground/5",
      },
    },
    onUpdate: ({ editor }) => {
      emitting.current = true;
      onChange(htmlToMarkdown(editor.getHTML()));
      // Cleared after the parent's state settles.
      queueMicrotask(() => { emitting.current = false; });
    },
  });

  // Re-seed only when the markdown changed elsewhere (e.g. the source view).
  useEffect(() => {
    if (!editor || emitting.current) return;
    if (htmlToMarkdown(editor.getHTML()) === value) return;
    editor.commands.setContent(markdownToHtml(value), { emitUpdate: false });
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL", "/images/blog/");
    if (!url) return;
    const alt = window.prompt("Alt text (describes the image to screen readers)", "") ?? "";
    editor.chain().focus().setImage({ src: url, alt }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-border bg-background/70 min-h-[30rem] flex items-center justify-center text-sm text-foreground/40">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background/70 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-foreground/[0.03] overflow-x-auto">
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo2 className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo2 className="w-4 h-4" />
        </Btn>

        <Divider />
        <BlockSelect editor={editor} />
        <Divider />

        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <Code className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align centre">
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
          <AlignRight className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bulleted list">
          <List className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
          <Quote className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <SquareCode className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn onClick={addLink} active={editor.isActive("link")} title="Insert link (Ctrl+K)">
          <Link2 className="w-4 h-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Remove link"
        >
          <Link2Off className="w-4 h-4" />
        </Btn>
        <Btn onClick={addImage} title="Insert image">
          <ImageIcon className="w-4 h-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert table"
        >
          <TableIcon className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </Btn>

        <div className="flex-1 min-w-2" />

        <button
          type="button"
          onClick={() => setMode((m) => (m === "visual" ? "markdown" : "visual"))}
          title={mode === "visual" ? "Edit the Markdown source" : "Back to the visual editor"}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.07] transition-colors shrink-0"
        >
          {mode === "visual" ? <Type className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{mode === "visual" ? "Source" : "Visual"}</span>
        </button>
      </div>

      {/* Body */}
      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground focus:outline-none resize-y"
        />
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-border bg-foreground/[0.02] text-[11px] text-foreground/45">
        <span>
          {mode === "visual" ? "Saved as Markdown" : "Editing Markdown source"}
        </span>
        <span className="tabular-nums">
          {count} {count === 1 ? "word" : "words"} · ~{Math.max(1, Math.round(count / 200))} min read
        </span>
      </div>
    </div>
  );
}
