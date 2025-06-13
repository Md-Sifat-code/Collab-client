"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";

export default function EditDoc() {
  const { id } = useParams();
  const [doc, setDoc] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        setDoc(res.data as { title: string; content: string });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoc();
  }, [id]);

  const updateDoc = async () => {
    try {
      await axios.put(`/documents/${id}`, doc);
      alert("Document updated");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <input
        className="border p-2 w-full text-lg font-bold mb-4"
        value={doc.title}
        onChange={(e) => setDoc({ ...doc, title: e.target.value })}
      />
      <textarea
        className="border p-2 w-full h-64"
        value={doc.content}
        onChange={(e) => setDoc({ ...doc, content: e.target.value })}
      />
      <button
        className="bg-green-600 text-white mt-4 px-4 py-2 rounded"
        onClick={updateDoc}
      >
        Save Changes
      </button>
    </div>
  );
}
