import React from 'react';
import ValidationMessage from './ValidationMessage';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  inputMode
}: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full font-sans">
      <label htmlFor={name} className="text-label-mono flex items-center">
        {label}
        {required && <span className="text-rose-600 ml-1 font-black">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full input-premium px-4 py-3.5 text-sm placeholder-slate-400 ${
          error ? "border-rose-500 focus:border-rose-500" : ""
        }`}
      />
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
