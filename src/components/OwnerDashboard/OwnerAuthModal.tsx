import React, { useState } from 'react';
import { Lock, X, AlertCircle, KeyRound, ShieldAlert } from 'lucide-react';
import { ownerLogin } from '../../services/api';

interface OwnerAuthModalProps {
  onSuccess: (token: string, owner: { name: string; email: string; role: string }) => void;
  onClose: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('owner@wemakesmile.com');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the owner access passcode.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await ownerLogin(password, email);
      onSuccess(res.token, res.owner);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Access is strictly restricted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
            Security Protected Gateway
          </div>
          <h3 className="text-xl font-bold font-display text-white mt-0.5">
            WeMakeSmile — Owner Dashboard
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access for the authorized clinic medical director and practice administration.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Owner Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Administrative Passcode
              </label>
              <span className="text-[10px] text-teal-800 font-mono">
                Hint: smile2026
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter owner passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Access Rights...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Authenticate to Owner Dashboard</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>All administrative sessions are logged for audit compliance.</span>
            </span>
          </div>
        </form>

      </div>
    </div>
  );
};
