import React from 'react';
import { LANGUAGES } from '../constants/languages';
import ValidationMessage from './ValidationMessage';

interface LanguageSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}

export default function LanguageSelect({
  value,
  onChange,
  error,
  required = false
}: LanguageSelectProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor="language" className="text-sm font-semibold text-slate-300 flex items-center">
        Preferred Language
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      <div className="relative">
        <select
          id="language"
          name="language"
          value={value}
          onChange={onChange}
          className={`w-full bg-slate-900 border ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
          } rounded-xl px-4 py-3 text-white text-base appearance-none transition-all outline-none focus:ring-4 cursor-pointer`}
        >
          <option value="" disabled className="text-slate-600">Select Preferred Language</option>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-white">
              {lang.name}
            </option>
          ))}
        </select>
        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
