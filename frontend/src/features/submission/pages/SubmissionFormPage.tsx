import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Send } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import FormField from '../components/FormField';
import TextArea from '../components/TextArea';
import CategorySelect from '../components/CategorySelect';
import LanguageSelect from '../components/LanguageSelect';
import { useSubmissionForm } from '../hooks/useSubmissionForm';

export default function SubmissionFormPage() {
  const navigate = useNavigate();
  const { values, errors, isTouched, isValid, handleChange } = useSubmissionForm();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Navigate to step 2: Voice
      navigate('/submit/voice');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      {/* Header navbar */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-900 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
          <Landmark className="h-6 w-6" />
          <span className="font-bold text-white tracking-tight">People's Priorities AI</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
      </header>

      {/* Main Form container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Top blue/indigo gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

          {/* Heading and Back Button */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Report Development Issue
            </h1>
          </div>

          {/* Progress Bar (Step 1 of 4 - Information) */}
          <ProgressBar currentStep={1} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <FormField
                label="Full Name"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="Enter your name (optional)"
              />

              {/* Mobile Number */}
              <FormField
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={values.mobileNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit number (optional)"
                inputMode="tel"
                error={isTouched.mobileNumber ? errors.mobileNumber : undefined}
              />
            </div>

            {/* Issue Title */}
            <FormField
              label="Issue Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Brief title of the issue (e.g. Potholes on Main Street)"
              required
              error={isTouched.title ? errors.title : undefined}
            />

            {/* Issue Description */}
            <TextArea
              label="Issue Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the problem. What infrastructure is broken? How is it affecting the community?"
              required
              maxLength={1000}
              error={isTouched.description ? errors.description : undefined}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category select */}
              <CategorySelect
                value={values.category}
                onChange={handleChange}
                required
                error={isTouched.category ? errors.category : undefined}
              />

              {/* Language select */}
              <LanguageSelect
                value={values.language}
                onChange={handleChange}
                required
                error={isTouched.language ? errors.language : undefined}
              />
            </div>

            {/* Action buttons */}
            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={!isValid}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all shadow-lg ${
                  isValid
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 cursor-pointer shadow-blue-500/20 hover:shadow-blue-500/30"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                }`}
              >
                Continue
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-6 border-t border-slate-900 text-center text-slate-600 text-xs sm:text-sm">
        © 2026 People's Priorities AI. All rights reserved.
      </footer>
    </div>
  );
}
