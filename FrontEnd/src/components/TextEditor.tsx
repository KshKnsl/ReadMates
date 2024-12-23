import React, { useState, useCallback} from "react";
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
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, ImageIcon, AlignLeft, AlignCenter, AlignRight, UnderlineIcon, SuperscriptIcon, SubscriptIcon, Highlighter, CheckSquare, Undo, Redo, Palette, User, Type, Heading1, Heading2, Minus, Search, BookOpen, Link2, TableIcon, YoutubeIcon } from 'lucide-react';
import { INTERESTS,getRandomColor } from "../constants";

import "./styles.css";
import { useParams } from "react-router-dom";

const doc = new Y.Doc();

interface TextEditorProps {
    setArticleData: (data: any) => void;
    articleData: any;
    userName: string;
}

const MAX_CHARACTERS = 50000;

const TextEditor: React.FC<TextEditorProps> = ({ articleData, setArticleData, userName }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { sessionID } = useParams<{ sessionID: string }>();
  const userColor = getRandomColor();

  const filteredInterests = INTERESTS.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleInterestToggle(tag: string) {
    setTags((prev = []) =>
      prev.includes(tag)
        ? prev.filter((i) => i !== tag)
        : [...prev, tag]
    );
  }

  const provider = new TiptapCollabProvider({
    name: `session-${sessionID}`,
    appId: import.meta.env.VITE_TIPTAPAPP_CLIENT_ID,
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
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: `${userName}`,
          color: `${userColor}`,
        },
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      Highlight,
      Link.configure({
        openOnClick: true,
      }),
      Mention,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your article content here...',
      }),
      CharacterCount.configure({
        limit: MAX_CHARACTERS,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Underline,
      Youtube.configure({
        width: 440,
        height: 280,
        controls: true,
      }),
    ],
    content: "<p>Start writing your article here...</p>",
    onUpdate: ({ editor }) => {
      setCharCount(editor.storage.characterCount.characters());
    },
  });

  const handleSave = useCallback(() => {
    setArticleData({ ...articleData, content: editor?.getHTML(), tags });
    console.log("Saving article:", { ...articleData, content: editor?.getHTML(), tags });
  }, [articleData, editor, tags, setArticleData]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('Enter the URL of the YouTube video:');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);
  const addTable = useCallback(() => {
    const rows = parseInt(prompt("Enter the number of rows:", "4") || "4", 10);
    const cols = parseInt(prompt("Enter the number of columns:", "3") || "3", 10);
    if (rows > 0 && cols > 0) {
      editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="shadow-lime-400 shadow-2xl create-article-container">
      <h2 className="text-2xl mb-4 font-bold text-amber-600">
        Create a new Article
      </h2>
      <Input
        type="text"
        placeholder="Title here"
        value={articleData?.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setArticleData({ ...articleData, title: e.target.value });
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
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "is-active" : ""}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            <Highlighter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            disabled={!editor.can().chain().focus().toggleSubscript().run()}
            className={editor.isActive("subscript") ? "is-active" : ""}
          >
            <SubscriptIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            disabled={!editor.can().chain().focus().toggleSuperscript().run()}
            className={editor.isActive("superscript") ? "is-active" : ""}
          >
            <SuperscriptIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
                return;
              }
              const url = prompt("Enter the URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          >
            <Code className="w-4 h-4" />
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
            onClick={() => editor.chain().focus().insertContent("@").run()}
          >
            <User className="w-4 h-4" />
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
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive("taskList") ? "is-active" : ""}
          >
            <CheckSquare className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button onClick={addImage}>
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button onClick={addTable}>
            <TableIcon className="w-4 h-4" />
          </Button>
          <Button onClick={addYoutubeVideo}>
            <YoutubeIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="editor-content" />
      <div className="editor-footer">
        <div className="char-count">Characters: {charCount}/{MAX_CHARACTERS}</div>
        {error && <div className="error-message">{error}</div>}
        <div className="connection-status">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select tags
        </label>
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-36 overflow-y-auto scrollbar-hidden">
          <div className="flex flex-wrap gap-2">
            {filteredInterests.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleInterestToggle(tag)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  tags.includes(tag)
                    ? "bg-amber-100 text-amber-800 border-2 border-amber-500"
                    : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                }`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
        {tags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected tags: {tags.join(", ")}
            </p>
          </div>
        )}
      </div>
      <Button onClick={handleSave} className="save-button">
        Save Article
      </Button>
    </div>
  );
};

export default TextEditor;