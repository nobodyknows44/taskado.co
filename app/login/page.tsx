'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151515] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-white/60">Sign in to your account</p>
        </div>

        <div className="bg-[#2D2A6E] rounded-2xl p-8 shadow-xl border border-white/10">
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

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