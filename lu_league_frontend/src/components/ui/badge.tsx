// src/components/ui/badge.tsx
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "success" | "destructive" | "outline";
}

export const Badge = ({ children, variant = "default" }: BadgeProps) => {
  const base =
    "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full";
  const variants: Record<string, string> = {
    default: "bg-gray-200 text-gray-800",
    secondary: "bg-blue-200 text-blue-800",
    success: "bg-green-200 text-green-800",
    destructive: "bg-red-200 text-red-800",
    outline: "border border-gray-300 text-gray-800",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};
