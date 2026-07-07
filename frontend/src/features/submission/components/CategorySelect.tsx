import React from 'react';
import { CATEGORIES } from '../constants/categories';
import ValidationMessage from './ValidationMessage';
import { useLanguage } from '../../landing/context/LanguageContext';

interface CategorySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}

export default function CategorySelect({
  value,
  onChange,
  error,
  required = false
}: CategorySelectProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-1.5 w-full font-sans">
      <label htmlFor="category" className="text-label-mono flex items-center">
        {t('labelCategory')}
        {required && <span className="text-rose-600 ml-1 font-black">*</span>}
      </label>
      <div className="relative">
        <select
          id="category"
          name="category"
          value={value}
          onChange={onChange}
          className={`w-full input-premium px-4 py-3.5 text-sm appearance-none cursor-pointer ${
            error ? "border-rose-500 focus:border-rose-500" : ""
          }`}
        >
          <option value="" disabled className="text-slate-400">
            {t('placeholderCategory')}
          </option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category} className="text-slate-800 bg-white">
              {t(category as any) || category}
            </option>
          ))}
        </select>
        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <ValidationMessage message={error} type="error" />
    </div>
  );
}
