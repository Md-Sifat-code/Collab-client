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
        const res = await axios.get<Document[]>("/documents");
        setDocs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans flex justify-center items-start p-12">
      <section className="max-w-4xl w-full bg-black rounded-3xl shadow-2xl p-10 text-white flex flex-col">
        {/* User info */}
        <div className="flex items-center gap-8 mb-10">
          <img
            src={user.avatar}
            alt={`${user.fullName} avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Welcome, <span className="text-gray-300">{user.fullName}</span>
            </h1>
            <p className="text-gray-400 mt-1 text-lg">{user.email}</p>
          </div>
        </div>

        <hr className="border-gray-700 mb-10" />

        {/* Documents Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-wide">Your Documents</h2>
            <Link
              href="/dashboard/new"
              className="bg-white text-black font-semibold rounded-lg px-5 py-2 hover:bg-gray-200 transition"
            >
              + Create New
            </Link>
          </div>

          {docs.length === 0 ? (
            <p className="text-gray-500 italic text-center mt-12 text-lg">
              No documents found.
            </p>
          ) : (
            <ul className="space-y-4">
              {docs.map((doc) => (
                <li
                  key={doc._id}
                  className="border border-gray-700 rounded-xl p-6 hover:border-white transition cursor-pointer"
                >
                  <Link href={`/dashboard/${doc._id}`} className="block">
                    <h3 className="text-xl font-semibold mb-1">{doc.title}</h3>
                    <p className="text-gray-400 text-sm">
                      Last updated: {new Date(doc.updatedAt).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
