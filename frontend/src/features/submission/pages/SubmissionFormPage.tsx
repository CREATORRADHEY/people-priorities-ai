import React, { FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Send } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import FormField from '../components/FormField';
import TextArea from '../components/TextArea';
import CategorySelect from '../components/CategorySelect';
import LanguageSelect from '../components/LanguageSelect';
import { useSubmissionForm } from '../hooks/useSubmissionForm';
import { useLanguage } from '../../landing/context/LanguageContext';
import { useSubmissionDraft } from '../hooks/useSubmissionDraft';

export default function SubmissionFormPage() {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();
  const { values, errors, isTouched, isValid, handleChange } = useSubmissionForm();
  const { updateDraft } = useSubmissionDraft();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    if (e.target.name === 'language') {
      setLanguage(e.target.value);
    }
  };

  useEffect(() => {
    if (language && !values.language) {
      const dummyEvent = {
        target: { name: 'language', value: language }
      } as any;
      handleChange(dummyEvent);
    }
  }, [language, values.language, handleChange]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) {
      updateDraft((prev) => ({
        ...prev,
        information: {
          fullName: values.fullName,
          mobileNumber: values.mobileNumber,
          title: values.title,
          description: values.description,
          category: values.category,
          language: values.language,
        },
      }));
      navigate('/submit/voice');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col justify-between selection:bg-slate-900/10 selection:text-slate-950 font-sans">
      {/* Header navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2.5 text-slate-900 hover:text-slate-700 transition-colors">
          <Landmark className="h-5 w-5 text-slate-950" />
          <span className="font-black text-slate-950 uppercase tracking-wider text-sm sm:text-base">{t('brandName')}</span>
        </Link>
        <Link
          to="/"
          className="text-label-mono text-slate-500 hover:text-slate-950 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('btnCancel')}
        </Link>
      </header>

      {/* Main Form container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 sm:px-6">
        <div className="card-premium p-6 sm:p-10 space-y-8 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B0B0C]" />

          {/* Heading and Back Button */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4 mr-1 text-slate-450" />
              {t('btnBack')}
            </Link>
            <h1 className="text-editorial-header text-xl sm:text-2xl text-slate-950 leading-tight">
              Tell us what happened in your community.
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              We translate and normalize your grievance using deterministic, explainable AI templates.
            </p>
          </div>

          {/* Progress Bar (Step 1 of 5) */}
          <ProgressBar currentStep={1} />

          {/* Guided Conversational Narrative Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            
            {/* The primary narrative workspace description first */}
            <TextArea
              label="Describe the issue in detail"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder={t('placeholderDescription')}
              required
              maxLength={1000}
              error={isTouched.description ? errors.description : undefined}
            />

            {/* Title Summary */}
            <FormField
              label={t('labelIssueTitle')}
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder={t('placeholderIssueTitle')}
              required
              error={isTouched.title ? errors.title : undefined}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Category selector */}
              <CategorySelect
                value={values.category}
                onChange={handleChange}
                required
                error={isTouched.category ? errors.category : undefined}
              />

              {/* Language selector */}
              <LanguageSelect
                value={values.language}
                onChange={handleSelectChange}
                required
                error={isTouched.language ? errors.language : undefined}
              />
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-2">
              <span className="text-label-mono font-bold uppercase tracking-wider">Reporter Contact (Optional)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label={t('labelFullName')}
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder={t('placeholderFullName')}
                />
                <FormField
                  label={t('labelMobile')}
                  name="mobileNumber"
                  type="tel"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  placeholder={t('placeholderMobile')}
                  inputMode="tel"
                  error={isTouched.mobileNumber ? errors.mobileNumber : undefined}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={!isValid}
                className={`btn-primary-pill inline-flex items-center justify-center gap-2 px-8 py-4 ${
                  isValid ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                }`}
              >
                {t('btnContinue')}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-200 text-center text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {t('footerCopyright')}
      </footer>
    </div>
  );
}
