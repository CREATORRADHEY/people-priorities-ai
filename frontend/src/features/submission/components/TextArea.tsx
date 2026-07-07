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
    <div className="flex flex-col space-y-1.5 w-full font-sans">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-label-mono flex items-center">
          {label}
          {required && <span className="text-rose-600 ml-1 font-black">*</span>}
        </label>
        {maxLength && (
          <span className="text-label-mono tracking-normal">
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
        className={`w-full input-premium px-4 py-3.5 text-sm placeholder-slate-400 resize-y min-h-[100px] ${
          error ? "border-rose-500 focus:border-rose-500" : ""
        }`}
      />
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
