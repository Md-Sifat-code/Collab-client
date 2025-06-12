"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDocumentScanner } from "react-icons/md";

export default function Home() {
  const router = useRouter();

  const getTokenFromCookie = (): string | undefined => {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : undefined;
  };

  const handleStartEditing = () => {
    const token = getTokenFromCookie();
    console.log("Token:", token); // debug output
    router.push(token ? "/dashboard" : "/login");
  };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3 mb-8">
          <MdOutlineDocumentScanner className="text-white text-5xl" />
          Real-Time Docs
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12">
          A minimalist, real-time text document editor in black & white.
        </p>
        <div className="flex justify-center">
          <motion.button
            onClick={handleStartEditing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-md font-semibold shadow-md transition-all"
          >
            <FaEdit />
            Start Editing
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
