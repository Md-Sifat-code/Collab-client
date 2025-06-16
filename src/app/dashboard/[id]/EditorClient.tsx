"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "@/utils/axios"; // <-- import fixed axios instance
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

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
  owner: string;
}

export default function EditorClient({ user, docId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("Untitled");
  const [isSaving, setIsSaving] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("editor");
  const [userCanShare, setUserCanShare] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Props["user"][]>([]);
  const hasInitialized = useRef(false);

  // Initialize socket per component instance
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnection: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const saveDoc = async (content: string) => {
    setIsSaving(true);
    try {
      // Use axios with cookies (from axios instance)
      await axios.put(`/documents/${docId}`, { title, content });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useCallback(debounce(saveDoc, 800), [title]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "Loading...",
    onUpdate({ editor }) {
      const content = editor.getHTML();
      debouncedSave(content);
      socket?.emit("send-changes", { docId, content });
    },
  });

  useEffect(() => {
    if (!editor || hasInitialized.current || !socket) return;

    hasInitialized.current = true;

    const fetchDoc = async () => {
      try {
        const res = await axios.get<DocumentResponse>(`/documents/${docId}`);
        setTitle(res.data.title || "Untitled");
        editor.commands.setContent(res.data.content || "");
        if (res.data.owner === user.id) setUserCanShare(true);
      } catch (err) {
        console.error("Error fetching document", err);
      }
    };

    // Join document room
    socket.emit("join", { docId, user });

    // Receive changes from other users
    socket.on("receive-changes", (newContent: string) => {
      const current = editor.getHTML();
      if (newContent !== current) {
        editor.commands.setContent(newContent);
      }
    });

    // Load document content from socket
    socket.on("load-document", (content: string) => {
      editor.commands.setContent(content);
    });

    // Update online users list
    socket.on("users-in-room", (users: Props["user"][]) => {
      setOnlineUsers(users);
    });

    // Notification when user joins
    socket.on("user-joined", (joinedUser: Props["user"]) => {
      if (joinedUser.id !== user.id) {
        toast(`${joinedUser.fullName} joined the document`);
      }
    });

    // Notification when user leaves
    socket.on("user-left", (leftUser: Props["user"]) => {
      if (leftUser.id !== user.id) {
        toast(`${leftUser.fullName} left the document`);
      }
    });

    fetchDoc();

    return () => {
      socket.emit("leave", docId);
      socket.off("receive-changes");
      socket.off("load-document");
      socket.off("users-in-room");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [docId, editor, socket, user]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/documents/${docId}/share`, {
        email: shareEmail,
        role: shareRole,
      });

      setShareEmail("");
      setShareRole("viewer");
    } catch (err) {
      console.error("Share failed:", err);
      alert("Failed to share document");
    }
  };

  return (
    <main className="min-h-screen p-12 bg-white font-sans text-gray-900">
      <div className="max-w-5xl mx-auto border border-gray-800 rounded-md shadow-lg bg-black text-white p-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-600 rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          ← Back
        </button>

        {/* Title */}
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

        {/* Online users */}
        {onlineUsers.length > 0 && (
          <div className="mb-4 text-sm text-green-400">
            Online: {onlineUsers.map((u) => u.fullName).join(", ")}
          </div>
        )}

        {/* Share Form */}
        {userCanShare && (
          <form
            onSubmit={handleShare}
            className="mb-6 flex flex-col md:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Share with email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="p-2 border rounded w-full text-white"
              required
            />
            <select
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value)}
              className="p-2 border rounded text-white bg-black"
            >
              <option value="viewer  bg-black">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </form>
        )}

        {/* Editor */}
        <div className="border border-gray-700 rounded-md p-6 bg-gray-50 text-black min-h-[400px] prose prose-invert max-w-full overflow-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </main>
  );
}
//oka
