import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
  fullName: string;
  avatar: string;
  iat: number;
}

export default async function DashboardPage() {
  const cookieStore = await cookies(); // ✅ FIXED: added await
  const token = cookieStore.get("token")?.value;

  let user: JwtPayload | null = null;

  if (token) {
    try {
      user = jwt.decode(token) as JwtPayload;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  if (!user) {
    return (
      <div className="p-10">
        <h2 className="text-lg">
          Unauthorized. Please{" "}
          <a href="/login" className="text-blue-600">
            log in
          </a>
          .
        </h2>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
      <p>Email: {user.email}</p>
      <img
        src={user.avatar}
        alt="avatar"
        className="w-16 h-16 rounded-full mt-4"
      />
    </div>
  );
}
