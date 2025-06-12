// app/login/page.tsx
"use client";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Login Page</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue with Google
      </button>
    </div>
  );
}
