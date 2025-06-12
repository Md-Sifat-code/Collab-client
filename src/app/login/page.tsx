"use client";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-8">Sign in to Real-Time Docs</h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium px-6 py-3 rounded-md hover:bg-gray-200 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.2h147.6c-6.4 34.7-25.5 64.1-54.3 83.5v69.3h87.7c51.3-47.2 80.5-116.7 80.5-197.7z"
              fill="#4285f4"
            />
            <path
              d="M272 544.3c73.5 0 135.2-24.3 180.2-66l-87.7-69.3c-24.4 16.4-55.6 26-92.6 26-71 0-131.1-47.9-152.7-112.3h-90.3v70.4c44.6 87.9 136.8 151.2 243.1 151.2z"
              fill="#34a853"
            />
            <path
              d="M119.3 322.7c-10.2-30.7-10.2-63.6 0-94.3v-70.4H29c-32.6 63.9-32.6 139.1 0 203z"
              fill="#fbbc04"
            />
            <path
              d="M272 107.7c39.9 0 75.9 13.7 104.3 40.6l78.1-78.1C407.2 24.5 345.5 0 272 0 165.7 0 73.5 63.3 29 151.2l90.3 70.4C140.9 155.6 201 107.7 272 107.7z"
              fill="#ea4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
