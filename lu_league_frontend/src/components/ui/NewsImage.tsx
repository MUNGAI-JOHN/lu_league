import React from "react";

interface NewsImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

const NewsImage: React.FC<NewsImageProps> = ({
  src,
  alt = "News image",
  className = "w-full h-64 object-cover rounded-xl shadow-md",
}) => {
  // fallback if no image provided
  const fallback = "https://via.placeholder.com/600x400.png?text=No+Image+Available";

  return <img src={src || fallback} alt={alt} className={className} />;
};

export default NewsImage;
