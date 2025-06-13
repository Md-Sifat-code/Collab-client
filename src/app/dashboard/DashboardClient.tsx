// src/app/dashboard/DashboardClient.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import Link from "next/link";

interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
}

interface Document {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function DashboardClient({ user }: { user: JwtPayload }) {
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get<Document[]>("/documents"); // Tell axios what to expect
        setDocs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 font-sans flex justify-center">
      <section className="bg-white p-8 rounded-xl shadow-xl max-w-3xl w-full">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user.avatar}
            alt={`${user.fullName} avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.fullName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <hr className="mb-6 border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Documents
          </h2>
          <Link
            href="/dashboard/new"
            className="text-blue-500 underline mb-4 inline-block"
          >
            + Create New
          </Link>

          <ul className="mt-6 space-y-2">
            {docs.map((doc) => (
              <li key={doc._id} className="border p-4 rounded shadow">
                <Link href={`/dashboard/${doc._id}`}>
                  <div className="text-lg font-semibold">{doc.title}</div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(doc.updatedAt).toLocaleString()}
                  </div>
                </Link>
              </li>
            ))}
            {docs.length === 0 && (
              <p className="text-gray-500">No documents found.</p>
            )}
          </ul>
        </section>
      </section>
    </main>
  );
}
