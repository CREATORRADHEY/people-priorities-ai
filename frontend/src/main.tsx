import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { db } from './lib/firebase';
import { model } from './lib/gemini';

function App() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health`)
      .then((res) => {
        if (!res.ok) throw new Error('Backend is unreachable');
        return res.json();
      })
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">People's Priorities AI</h1>
          <p className="text-slate-400 mt-2">FP-1.1: Project Foundation</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-sm text-slate-300 font-medium">React Frontend</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-500/20 text-green-400">Running</span>
          </div>

          <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-sm text-slate-300 font-medium">Backend Health API</span>
            {loading ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-yellow-500/20 text-yellow-400">Checking...</span>
            ) : error ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400">Error: {error}</span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-500/20 text-green-400">{health?.status || 'Healthy'}</span>
            )}
          </div>

          <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-sm text-slate-300 font-medium">Firebase SDK</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-500/20 text-green-400">
              {db ? 'Initialized' : 'Error'}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-sm text-slate-300 font-medium">Gemini SDK</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-500/20 text-green-400">
              {model ? 'Initialized' : 'Error'}
            </span>
          </div>
        </div>

        {health && (
          <div className="text-xs text-center text-slate-500 mt-4">
            Service: {health.service} | Version: {health.version}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
