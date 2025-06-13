// src/app/dashboard/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardClient from "./DashboardClient";

interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  iat: number;
  exp: number;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: JwtPayload | null = null;
  if (token) {
    try {
      user = jwt.decode(token) as JwtPayload;
    } catch {
      user = null;
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-gray-100 p-8 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Unauthorized</h2>
          <p>
            Please{" "}
            <a href="/login" className="text-blue-500 underline">
              log in
            </a>{" "}
            to access your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return <DashboardClient user={user} />;
}
