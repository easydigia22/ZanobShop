import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

const AUTH_KEY = 'hajarshop_admin_auth';

export const isAdminAuthenticated = (): boolean =>
  sessionStorage.getItem(AUTH_KEY) === 'true';

export const logoutAdmin = (): void => {
  sessionStorage.removeItem(AUTH_KEY);
};

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 mb-4">
            <Lock className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-xl font-bold text-white">Espace Admin</h1>
          <p className="text-sm text-slate-400 mt-1">
            Entrez le mot de passe pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Mot de passe"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                error
                  ? 'border-red-500/60 focus:ring-red-500/40'
                  : 'border-slate-700 focus:ring-amber-500/40'
              }`}
            />
            {error && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                Mot de passe incorrect
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition"
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};
