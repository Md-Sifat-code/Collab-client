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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">New Document</h1>
      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={createDocument}
      >
        Create
      </button>
    </div>
  );
}
