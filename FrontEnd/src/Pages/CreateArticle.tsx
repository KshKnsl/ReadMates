import React, { useEffect, useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import * as Y from "yjs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Undo,
  Redo,
  Type,
  Eraser,
  Palette,
  Link2,
  Highlighter,
  User,
} from "lucide-react";

import "./styles.scss";

const doc = new Y.Doc();

const CreateArticle: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState<number>(0);

  const provider = new TiptapCollabProvider({
    name: "document-name",
    appId: "x9loxyv9",
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzQ4ODMzNjcsIm5iZiI6MTczNDg4MzM2NywiZXhwIjoxNzM0OTY5NzY3LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJ4OWxveHl2OSJ9.qkg86myXMBSv89_HKZ89KchAxiLEcQSgfpQ_miGevKk",
    document: doc,
    onConnect: () => {
      setIsConnected(true);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnected(false);
      setError(
        "Disconnected from the collaboration server. Trying to reconnect..."
      );
    },
  });

  const editor = useEditor({
    extensions: [
      CollaborationCursor.configure({
        provider,
        user: {
          name: "Cyndi Lauper",
          color: "#f783ac",
        },
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        history: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Collaboration.configure({
        document: doc,
      }),
      TextStyle,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Highlight,
      Link.configure({
        openOnClick: true,
      }),
      Mention.configure({
        suggestion: {
          items: ({ query }) => {
            const users = ["Alice", "Bob", "Charlie"];
            return users.filter((user) =>
              user.toLowerCase().startsWith(query.toLowerCase())
            );
          },
        },
      }),
    ],
    content: "<p>Start writing your article here...</p>",
    onUpdate: ({ editor }) => {
      setCharCount(editor.storage.characterCount.characters());
    },
  });

  const handleSave = useCallback(() => {
    console.log("Saving article:", { title, content: editor?.getHTML() });
  }, [title, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gradient-to-tl from-amber-500 to-yellow-400 create-article-container">
      <Input
        type="text"
        placeholder="Title here"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTitle(e.target.value);
        }}
        className="article-title-input"
      />
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold className="w-4 h-4" /> Bold
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic className="w-4 h-4" /> Italic
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            <Highlighter className="w-4 h-4" /> Highlight
          </Button>
                <Button
                onClick={() => {
                  if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                  }
                  const url = prompt("Enter the URL");
                  if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                  editor.chain().focus().toggleBold().run();
                  editor.chain().focus().toggleItalic().run();
                  editor.chain().focus().setColor("#0000FF").run();
                  }
                }}
                className={editor.isActive("link") ? "is-active" : ""}
                >
                <Link2 className="w-4 h-4" /> <span className="ml-1">Link</span>
                </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          >
            <Code className="w-4 h-4" /> Code
          </Button>
          <div
            className="relative flex items-center gap-2 px-4 py-2 text-amber-600 rounded-md bg-white border border-amber-500"
            style={{ backgroundColor: editor.getAttributes("textStyle").color }}
          >
            <Palette className="w-5 h-5" />
            <input
              type="color"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="text-sm ml-2">
              {editor.getAttributes("textStyle").color || "Default"}
            </span>
          </div>
          <Button
            onClick={() => editor.chain().focus().insertContent('@').run()}
          >
            <User className="w-4 h-4" /> Mention
          </Button>
        </div>

        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <Heading2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="w-4 h-4" /> Horizontal Rule
          </Button>
        </div>

        <div className="toolbar-group">
          <Button onClick={() => editor.chain().focus().clearNodes().run()}>
            <Eraser className="w-4 h-4" /> Eraser
          </Button>
        </div>

        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="w-4 h-4" />
            Undo
          </Button>
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="w-4 h-4" /> Redo
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="editor-content" />
      <div className="editor-footer">
        <div className="char-count">Characters: {charCount}</div>
        {error && <div className="error-message">{error}</div>}
        <div className="connection-status">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      <Button onClick={handleSave} className="save-button">
        Save Article
      </Button>
    </div>
  );
};

export default CreateArticle;
