// src/components/ui/card.tsx
import React from "react";
import type{ReactNode} from "react";

// -------------------
// Props interfaces
// -------------------
interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

// -------------------
// Components
// -------------------
export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`bg-white shadow rounded-lg ${className || ""}`}>{children}</div>;
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={`p-4 ${className || ""}`}>{children}</div>;
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={`border-b p-4 ${className || ""}`}>{children}</div>;
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return <h3 className={`text-lg font-bold ${className || ""}`}>{children}</h3>;
};

