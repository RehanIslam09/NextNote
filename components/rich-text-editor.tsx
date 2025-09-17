"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { mergeAttributes, Mark } from "@tiptap/core";
import Tag from "@/components/extensions/Tag";
import { TextStyle } from "@tiptap/extension-text-style";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Extension } from "@tiptap/core";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Undo as UndoIcon,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from "lucide-react";
import { updateNote } from "@/server/notes";

interface RichTextEditorProps {
  content?: JSONContent[];
  noteId?: string;
}

const ExitListOnEnter = Extension.create({
  name: "exitListOnEnter",
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
          const { empty, $from } = editor.state.selection;
          if (empty && $from.parent.content.size === 0) {
            return editor.chain().focus().splitListItem("listItem").run() ||
              editor.chain().focus().liftListItem("listItem").run();
          }
        }
        return false;
      },
    };
  },
});

const ExitOnSpace = Extension.create({
  name: "exitOnSpace",
  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        if (editor.isActive("superscript")) {
          editor.commands.unsetSuperscript();
          editor.commands.insertContent(" ");
          return true;
        }
        if (editor.isActive("subscript")) {
          editor.commands.unsetSubscript();
          editor.commands.insertContent(" ");
          return true;
        }
        return false;
      },
    };
  },
});

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc ml-4 md:ml-6" },
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-4 md:ml-6" },
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: { class: "mb-1" },
        },
        heading: { levels: [1, 2, 3] },
      }),
      Document,
      Paragraph,
      Text,
      Underline,
      Tag,
      TextStyle,
      Superscript,
      ExitOnSpace,
      ExitListOnEnter,
      Subscript,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class:
            "px-1 rounded-md bg-gradient-to-r from-purple-400/30 to-pink-400/30 text-purple-600 dark:text-pink-300 underline decoration-dotted hover:decoration-solid hover:from-purple-400/50 hover:to-pink-400/50 transition-all cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (noteId) {
        const content = editor.getJSON();
        updateNote(noteId, { content });
      }
    },
    content: content ?? {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Getting started" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Welcome to the " },
            {
              type: "text",
              text: "Simple Editor",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " template! This template integrates " },
            { type: "text", text: "open source", marks: [{ type: "bold" }] },
            {
              type: "text",
              text: " UI components and Tiptap extensions licensed under ",
            },
            { type: "text", text: "MIT", marks: [{ type: "bold" }] },
            { type: "text", text: "." },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Integrate it by following the " },
            {
              type: "text",
              text: "Tiptap UI Components docs",
              marks: [{ type: "code" }],
            },
            { type: "text", text: " or using our CLI tool." },
          ],
        },
        {
          type: "codeBlock",
          content: [{ type: "text", text: "npx @tiptap/cli init" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Features" }],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown ",
                },
                { type: "text", text: "**", marks: [{ type: "bold" }] },
                { type: "text", text: " or use keyboard shortcuts " },
                { type: "text", text: "⌘+B", marks: [{ type: "code" }] },
                { type: "text", text: " for most all common markdown marks." },
              ],
            },
          ],
        },
      ],
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor?.isActive("bold"),
        canBold: ctx.editor?.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor?.isActive("italic"),
        canItalic: ctx.editor?.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor?.isActive("strike"),
        canStrike: ctx.editor?.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor?.isActive("code"),
        canCode: ctx.editor?.can().chain().focus().toggleCode().run(),
        isParagraph: ctx.editor?.isActive("paragraph"),
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isOrderedList: ctx.editor?.isActive("orderedList"),
        isCodeBlock: ctx.editor?.isActive("codeBlock"),
        isBlockquote: ctx.editor?.isActive("blockquote"),
        canUndoIcon: ctx.editor?.can().chain().focus().undo().run(),
        canRedo: ctx.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  const getActiveHeading = () => {
    if (editorState?.isHeading1) return "H1";
    if (editorState?.isHeading2) return "H2";
    if (editorState?.isHeading3) return "H3";
    return "Paragraph";
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-card text-card-foreground rounded-lg overflow-hidden border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 md:p-3 bg-muted/50 border-b overflow-x-auto">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editorState?.canUndoIcon}
            className="size-7 md:size-8 lg:size-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <UndoIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editorState?.canRedo}
            className="size-7 md:size-8 lg:size-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Redo className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="w-px h-5 md:h-6 bg-border mx-1" />

        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 md:h-8 lg:h-9 px-2 md:px-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
            >
              <span className="hidden sm:inline">{getActiveHeading()}</span>
              <span className="sm:hidden">{getActiveHeading().charAt(0)}</span>
              <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border">
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all ${editor?.isActive("bulletList")
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all ${editor?.isActive("orderedList")
              ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <ListOrdered className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="w-px h-5 md:h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editorState?.canBold}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editorState?.isBold
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Bold className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editorState?.canItalic}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editorState?.isItalic
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Italic className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editorState?.canStrike}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editorState?.isStrike
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Strikethrough className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editorState?.canCode}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editorState?.isCode
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Code className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editor?.isActive("underline")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <UnderlineIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="w-px h-5 md:h-6 bg-border mx-1" />

        {/* Additional Tools */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!editor) return;

              const prev = editor.getAttributes("link").href;
              const url = window.prompt("Enter URL (leave blank to remove)", prev ?? "");

              if (url === null) return;

              const clean = url.trim();

              if (clean === "") {
                editor.chain().focus().unsetLink().run();
                return;
              }

              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({
                  href: clean,
                  target: "_blank",
                  rel: "noopener noreferrer",
                })
                .run();
            }}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:bg-accent ${editor?.isActive("link")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <LinkIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          {/* Superscript / Subscript */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:text-foreground hover:bg-accent ${editor?.isActive("superscript") ? "text-foreground bg-accent" : "text-muted-foreground"
              }`}
          >
            <SuperscriptIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            className={`size-7 md:size-8 lg:size-9 p-0 hover:text-foreground hover:bg-accent ${editor?.isActive("subscript") ? "text-foreground bg-accent" : "text-muted-foreground"
              }`}
          >
            <SubscriptIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="w-px h-5 md:h-6 bg-border mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor?.isActive({ textAlign: "left" })) {
                editor.chain().focus().setTextAlign("").run();
              } else {
                editor?.chain().focus().setTextAlign("left").run();
              }
            }}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all duration-300 ${editor?.isActive({ textAlign: "left" })
              ? "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.6)]"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <AlignLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor?.isActive({ textAlign: "center" })) {
                editor.chain().focus().setTextAlign("").run();
              } else {
                editor?.chain().focus().setTextAlign("center").run();
              }
            }}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all duration-300 ${editor?.isActive({ textAlign: "center" })
              ? "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-300 text-white shadow-[0_0_10px_rgba(244,114,182,0.7)]"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <AlignCenter className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor?.isActive({ textAlign: "right" })) {
                editor.chain().focus().setTextAlign("").run();
              } else {
                editor?.chain().focus().setTextAlign("right").run();
              }
            }}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all duration-300 ${editor?.isActive({ textAlign: "right" })
              ? "bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 text-white shadow-[0_0_10px_rgba(219,39,119,0.6)]"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <AlignRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor?.isActive({ textAlign: "justify" })) {
                editor.chain().focus().setTextAlign("").run();
              } else {
                editor?.chain().focus().setTextAlign("justify").run();
              }
            }}
            className={`size-7 md:size-8 lg:size-9 p-0 transition-all duration-300 ${editor?.isActive({ textAlign: "justify" })
              ? "bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 text-white shadow-[0_0_10px_rgba(190,24,93,0.6)]"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <AlignJustify className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add Tag Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!editor) return;

            const { state } = editor;
            const { from, to, empty } = state.selection;

            if (!empty) {
              const selectedText = state.doc.textBetween(from, to, " ");
              editor.chain().focus().setTag(selectedText).run();
              return;
            }

            editor
              .chain()
              .focus()
              .setTag("")
              .insertContent("#")
              .run();
          }}
          className="h-7 md:h-8 lg:h-9 px-2 md:px-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
        >
          <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Add a Tag</span>
          <span className="sm:hidden">Tag</span>
        </Button>
      </div>

      {/* Editor Content */}
      <div className="p-3 md:p-4 lg:p-6 bg-card max-h-[400px] md:max-h-[500px] lg:max-h-[700px] overflow-y-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:border-2
                  [&::-webkit-scrollbar-thumb]:border-transparent
                  [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                  [&::-webkit-scrollbar-thumb]:from-violet-400
                  [&::-webkit-scrollbar-thumb]:via-fuchsia-400
                  [&::-webkit-scrollbar-thumb]:to-pink-300
                  [&::-webkit-scrollbar-thumb]:bg-clip-padding
                  hover:[&::-webkit-scrollbar-thumb]:from-violet-500
                  hover:[&::-webkit-scrollbar-thumb]:via-fuchsia-500
                  hover:[&::-webkit-scrollbar-thumb]:to-pink-400">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none
                      [&_.ProseMirror]:focus:outline-none
                      [&_.ProseMirror]:min-h-48 md:[&_.ProseMirror]:min-h-72 lg:[&_.ProseMirror]:min-h-96

                      [&_.ProseMirror_h1]:text-lg md:[&_.ProseMirror_h1]:text-2xl lg:[&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-2 md:[&_.ProseMirror_h1]:mb-3
                      [&_.ProseMirror_h2]:text-base md:[&_.ProseMirror_h2]:text-xl lg:[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-2
                      [&_.ProseMirror_h3]:text-sm md:[&_.ProseMirror_h3]:text-lg lg:[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mb-2
                      [&_.ProseMirror_p]:text-sm md:[&_.ProseMirror_p]:text-base [&_.ProseMirror_p]:mb-2 md:[&_.ProseMirror_p]:mb-3

                      [&_.ProseMirror_blockquote]:border-l-2 md:[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-2 md:[&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:italic

                      [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-2 md:[&_.ProseMirror_pre]:p-3 lg:[&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:text-xs md:[&_.ProseMirror_pre]:text-sm
                      [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-xs md:[&_.ProseMirror_code]:text-sm

                      [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-4 md:[&_.ProseMirror_ul]:ml-6
                      [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-4 md:[&_.ProseMirror_ol]:ml-6
                      [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_li]:text-sm md:[&_.ProseMirror_li]:text-base"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
