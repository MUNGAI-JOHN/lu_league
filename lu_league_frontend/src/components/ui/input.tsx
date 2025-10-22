import React from "react";

interface InputProps {
  type?: string; // ✅ add this
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ type = "text", value, onChange, placeholder }) => {
  return (
    <input
      type={type} // now type is recognized
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded p-2 w-full mb-2"
    />
  );
};

export default Input;
