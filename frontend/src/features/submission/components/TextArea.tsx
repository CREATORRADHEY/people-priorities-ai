import React from 'react';
import ValidationMessage from './ValidationMessage';

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  maxLength
}: TextAreaProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-sm font-semibold text-slate-300 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-slate-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full bg-slate-900 border ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
        } rounded-xl px-4 py-3 text-white text-base placeholder-slate-500 transition-all outline-none focus:ring-4 resize-y min-h-[100px]`}
      />
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
