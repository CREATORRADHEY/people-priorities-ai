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
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor={name} className="text-sm font-semibold text-slate-300 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full bg-slate-900 border ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
        } rounded-xl px-4 py-3 text-white text-base placeholder-slate-500 transition-all outline-none focus:ring-4`}
      />
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
