"use client";
import { useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function NewDoc() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const createDocument = async () => {
    try {
      const res = await axios.post<{ _id: string }>("/documents", { title });
      router.push(`/dashboard/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center px-6 py-12 font-sans">
      <section className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 flex flex-col">
        <h1 className="text-3xl font-extrabold text-black mb-8 text-center tracking-tight">
          New Document
        </h1>
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            border border-gray-300 rounded-lg px-4 py-3
            text-black text-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-black
            transition
            placeholder:text-gray-400
            mb-8
          "
        />
        <button
          onClick={createDocument}
          disabled={!title.trim()}
          className={`
            bg-black text-white font-semibold rounded-lg px-6 py-3
            hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition
          `}
          aria-disabled={!title.trim()}
        >
          Create
        </button>
      </section>
    </main>
  );
}
