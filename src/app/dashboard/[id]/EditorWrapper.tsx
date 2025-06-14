"use client";

import dynamic from "next/dynamic";

const EditorClient = dynamic(() => import("./EditorClient"), { ssr: false });

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
}

interface Props {
  user: User;
  docId: string;
}

export default function EditorWrapper({ user, docId }: Props) {
  return <EditorClient user={user} docId={docId} />;
}
