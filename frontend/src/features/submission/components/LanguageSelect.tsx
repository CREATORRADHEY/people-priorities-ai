import React from 'react';
import { LANGUAGES } from '../constants/languages';
import ValidationMessage from './ValidationMessage';
import { useLanguage } from '../../landing/context/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-1.5 w-full font-sans">
      <label htmlFor="language" className="text-label-mono flex items-center">
        {t('labelPrefLanguage')}
        {required && <span className="text-rose-600 ml-1 font-black">*</span>}
      </label>
      <div className="relative">
        <select
          id="language"
          name="language"
          value={value}
          onChange={onChange}
          className={`w-full input-premium px-4 py-3.5 text-sm appearance-none cursor-pointer ${
            error ? "border-rose-500 focus:border-rose-500" : ""
          }`}
        >
          <option value="" disabled className="text-slate-400">
            {t('placeholderPrefLanguage')}
          </option>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-800 bg-white">
              {t(`lang_${lang.code}` as any) || lang.name}
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
