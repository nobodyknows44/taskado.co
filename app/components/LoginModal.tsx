'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (error: any) {
      setError(
        isLoginView 
          ? 'Invalid email or password' 
          : error.code === 'auth/email-already-in-use'
            ? 'Email already in use'
            : 'Error creating account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#2D2A6E] rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white/90">
            {isLoginView ? 'Sign In' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white/90 
                  placeholder-white/30 border border-white/10 focus:border-[#f5d820]/30 
                  focus:ring-0 focus:bg-white/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white/90 
                  placeholder-white/30 border border-white/10 focus:border-[#f5d820]/30 
                  focus:ring-0 focus:bg-white/10 transition-all"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#f5d820] text-[#1E1B4B] 
                font-medium hover:bg-[#f5d820]/90 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-[#f5d820] disabled:opacity-50 
                disabled:cursor-not-allowed transition-all"
            >
              {isLoading 
                ? (isLoginView ? 'Signing in...' : 'Creating account...') 
                : (isLoginView ? 'Sign in' : 'Create account')}
            </button>

            {/* Toggle between login and signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError('');
                }}
                className="text-[#f5d820] hover:text-[#f5d820]/80 text-sm transition-colors"
              >
                {isLoginView 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#2D2A6E] text-white/60">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full py-3 px-4 rounded-xl bg-white/5 text-white/90 
                font-medium hover:bg-white/10 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-[#f5d820] transition-all flex 
                items-center justify-center gap-3"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 