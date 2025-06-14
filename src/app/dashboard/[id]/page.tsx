import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import EditorWrapper from "./EditorWrapper"; // import normally, NOT dynamic

interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  iat: number;
  exp: number;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
}

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
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
            to access this document.
          </p>
        </div>
      </main>
    );
  }

  const mappedUser: User = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
  };

  return <EditorWrapper user={mappedUser} docId={params.id} />;
}
