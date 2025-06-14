"use client";

import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "@/utils/axios";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
  docId: string;
}

interface DocumentResponse {
  title: string;
  content: string;
}

export default function EditorClient({ user, docId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("Untitled");
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "Loading...",
    onUpdate({ editor }) {
      const content = editor.getHTML();
      debouncedSave(content);
    },
  });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get<DocumentResponse>(`/documents/${docId}`);
        setTitle(res.data.title || "Untitled");
        editor?.commands.setContent(res.data.content || "");
      } catch (err) {
        console.error("Error fetching document", err);
      }
    };
    if (editor) fetchDoc();
  }, [editor, docId]);

  const saveDoc = async (content: string) => {
    setIsSaving(true);
    try {
      await axios.put(`/documents/${docId}`, {
        title,
        content,
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useCallback(debounce(saveDoc, 800), [title]);

  return (
    <main className="min-h-screen p-12 bg-white font-sans text-gray-900">
      <div className="max-w-5xl mx-auto border border-gray-800 rounded-md shadow-lg bg-black text-white p-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-600 rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Go back"
          type="button"
        >
          ← Back
        </button>

        <textarea
          className="text-3xl font-extrabold mb-6 w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white transition-colors caret-white placeholder-gray-400 resize-none"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => saveDoc(editor?.getHTML() || "")}
          rows={2}
        />

        <div className="mb-4 text-sm font-medium text-gray-400">
          {isSaving ? "Saving..." : "All changes saved"}
        </div>
        <div className="border border-gray-700 rounded-md p-6 bg-gray-50 text-black min-h-[400px] prose prose-invert max-w-full overflow-auto">
          <EditorContent className="border h-48" editor={editor} />
        </div>
      </div>
    </main>
  );
}
