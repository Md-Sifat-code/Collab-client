"use client";

import { useState } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export default function Avatar({ src, alt, className }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc("/default-avatar.png")} // fallback image
    />
  );
}
