import React, { useState, useCallback, useContext } from "react";
import { useEffect } from "react";
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
import { AuthContext } from "../context/AuthContext";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UnderlineIcon,
  SuperscriptIcon,
  SubscriptIcon,
  Highlighter,
  CheckSquare,
  Undo,
  Redo,
  User,
  Type,
  Heading1,
  Heading2,
  Minus,
  Search,
  BookOpen,
  Link2,
  TableIcon,
  YoutubeIcon,
} from "lucide-react";
import { INTERESTS, getRandomColor } from "../constants";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";

const doc = new Y.Doc();

interface TextEditorProps {
  setArticleData: (data: any) => void;
  articleData: any;
  userName: string;
  docName: string;
}

const MAX_CHARACTERS = 50000;

const TextEditor: React.FC<TextEditorProps> = ({
  articleData,
  setArticleData,
  userName,
  docName,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [tags, setTags] = useState<string[]>(articleData.tags || []);
    const auth = useContext(AuthContext);

  useEffect(() => {
    if (articleData.tags) {
      setTags(articleData.tags);
    }
  }, [articleData.tags]);

  const [searchTerm, setSearchTerm] = useState("");
  const userColor = getRandomColor();
  const navigate = useNavigate();
  const [saving, setSaving] = useState<boolean>(false);
  const filteredInterests = INTERESTS.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleInterestToggle(tag: string) {
    setTags((prev = []) =>
      prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag]
    );
  }

  const provider = new TiptapCollabProvider({
    name: `${docName}`,
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
        placeholder: "Write your article content here...",
      }),
      CharacterCount.configure({
        limit: MAX_CHARACTERS,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
      setArticleData((preData: any) => ({
        ...preData,
        content: editor.getHTML(),
      }));
    },
  });
  
  const handleSave = async () => {
    setSaving(true);
    let sesID = docName;
    const result = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/colab/getColab/${sesID}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    if (result.ok) 
    {
      const sessData = await result.json();
      setArticleData((prevData: any) => ({ ...prevData, content: editor?.getHTML(), tags, contributors: sessData.Contributor, sessionDoc: sessData.sessionId }));

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/article/createArticle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...articleData, 
          content: editor?.getHTML(), 
          tags, 
          contributors: sessData.Contributor, 
          sessionDoc: sessData.sessionId, 
          desc: "",
          publishedAt: new Date(),
        }),  
      });
      if (res.ok) 
      {
        const data = await res.json();
        // console.log(data);
        setSaving(false);
        toast.success(data.message);
        setTimeout(() => {
          navigate(`/article/${data.article._id}`);
        }, 2000);
      } 
      else
      {
        toast.error("Error creating article, you are missing a required field!!");
      }
    } 
    else 
    {
      setSaving(false);
      console.log("Error creating article");
    }
  };

  const addImage = useCallback(() => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt("Enter the URL of the YouTube video:");
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);
  const addTable = useCallback(() => {
    const rows = parseInt(prompt("Enter the number of rows:", "4") || "4", 10);
    const cols = parseInt(
      prompt("Enter the number of columns:", "3") || "3",
      10
    );
    if (rows > 0 && cols > 0) {
      editor
        ?.chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: true })
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="shadow-2xl create-article-container p-6 bg-amber-50 dark:bg-gray-800">
      <h2 className="text-3xl mb-4 font-bold text-amber-700 dark:text-amber-300">
      {(docName.split("-").pop() === auth?.user?._id)? "Create a new Article":"Contribute to Article"}
      </h2>
      {(docName.split("-").pop() === auth?.user?._id &&
      <Input
        type="text"
        placeholder="Title here"
        value={articleData?.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setArticleData({ ...articleData, title: e.target.value });
        }}
        className="article-title-input bg-amber-50 dark:bg-gray-800 text-amber-700 dark:text-amber-300"
      />)}
      <div className="editor-toolbar dark:bg-gray-800">
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${
              editor.isActive("bold") ? "bg-amber-100 dark:bg-gray-700" : ""
            }`}
          >
            <Bold className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive("italic") ? "bg-amber-100 dark:bg-gray-700" : ""
            }`}
          >
            <Italic className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`${
              editor.isActive("underline")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <UnderlineIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`${
              editor.isActive("strike") ? "bg-amber-100 dark:bg-gray-700" : ""
            }`}
          >
            <Strikethrough className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            className={`${
              editor.isActive("highlight")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <Highlighter className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            disabled={!editor.can().chain().focus().toggleSubscript().run()}
            className={`${
              editor.isActive("subscript")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <SubscriptIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            disabled={!editor.can().chain().focus().toggleSuperscript().run()}
            className={`${
              editor.isActive("superscript")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <SuperscriptIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
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
            className={`${
              editor.isActive("link") ? "bg-amber-100 dark:bg-gray-700" : ""
            }`}
          >
            <Link2 className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`${
              editor.isActive("code") ? "bg-amber-100 dark:bg-gray-700" : ""
            }`}
          >
            <Code className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().insertContent("@").run()}
          >
            <User className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${
              editor.isActive("paragraph")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <Type className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 1 })
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <Heading1 className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 })
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <Heading2 className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${
              editor.isActive("bulletList")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <List className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${
              editor.isActive("orderedList")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <ListOrdered className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`${
              editor.isActive("taskList")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${
              editor.isActive("blockquote")
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <Quote className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button onClick={addImage}>
            <ImageIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button onClick={addTable}>
            <TableIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button onClick={addYoutubeVideo}>
            <YoutubeIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`${
              editor.isActive({ textAlign: "left" })
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <AlignLeft className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`${
              editor.isActive({ textAlign: "center" })
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <AlignCenter className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`${
              editor.isActive({ textAlign: "right" })
                ? "bg-amber-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <AlignRight className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
          <Button onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="editor-content bg-amber-50 dark:bg-gray-800 text-amber-700 dark:text-amber-300 min-h-96" />
      <div className="editor-footer">
        <div className="char-count text-amber-700 dark:text-amber-300 dark:bg-gray-700">
          Characters: {charCount}/{MAX_CHARACTERS}
        </div>
        {error && <div className="error-message text-red-500">{error}</div>}
        <div className="connection-status text-amber-700 dark:text-amber-300 dark:bg-gray-700">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {(docName.split("-").pop() === auth?.user?._id &&
      
      <div>
        <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
          Select tags
        </label>
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all dark:bg-gray-800 dark:text-amber-300"
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
                    ? "bg-amber-100 text-amber-800 border-2 border-amber-500 dark:bg-gray-600 dark:text-amber-300"
                    : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300 dark:bg-gray-700 dark:text-amber-300 dark:hover:bg-opacity-30"
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
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Selected tags: {tags.join(", ")}
            </p>
          </div>
        )}
      </div>)}
      {(docName.split("-").pop() === auth?.user?._id &&
      <Button onClick={handleSave} disabled={saving} className="save-button bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-opacity-30">
        {saving ? "Saving..." : "Save Article"}
      </Button>)}
      <ToastContainer />
    </div>
  );
};

export default TextEditor;
