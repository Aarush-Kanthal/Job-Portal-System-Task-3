import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Shield, User as UserIcon, Briefcase, Mail, Lock, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (newUser: User) => void;
}

export default function Auth({ onLogin, users, onRegister }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Simulated auth
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Candidate');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('User not found. Try one of the seeded emails below or sign up!');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setError('Email is already registered.');
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      role,
      joinedAt: new Date().toISOString(),
      skills: [],
    };

    onRegister(newUser);
  };

  const loginAsMockUser = (mockEmail: string) => {
    const found = users.find(u => u.email === mockEmail);
    if (found) {
      onLogin(found);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="bg-neutral-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700/50 mb-3">
              <Briefcase className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-medium tracking-tight font-sans">
              {isLogin ? 'Welcome to JobPortal' : 'Create an Account'}
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              {isLogin ? 'Sign in to access your dashboard' : 'Join as a recruiter or candidate'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Candidate')}
                    className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      role === 'Candidate'
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Recruiter')}
                    className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      role === 'Recruiter'
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Recruiter
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white font-medium text-sm rounded-lg transition-all shadow-sm mt-2 cursor-pointer"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle Screen */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Seed accounts helper for easy demo testing */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium mb-2 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Quick Login Demo Roles</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100/80 transition-all border border-neutral-200/50">
                <span className="font-medium text-neutral-700">Sarah (Admin)</span>
                <button
                  onClick={() => loginAsMockUser('admin@jobportal.com')}
                  className="text-neutral-900 font-semibold hover:underline bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-sm cursor-pointer"
                >
                  Login
                </button>
              </div>
              <div className="flex justify-between items-center text-[11px] p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100/80 transition-all border border-neutral-200/50">
                <span className="font-medium text-neutral-700">Marcus (Stripe Recruiter)</span>
                <button
                  onClick={() => loginAsMockUser('recruiter1@stripe.com')}
                  className="text-neutral-900 font-semibold hover:underline bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-sm cursor-pointer"
                >
                  Login
                </button>
              </div>
              <div className="flex justify-between items-center text-[11px] p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100/80 transition-all border border-neutral-200/50">
                <span className="font-medium text-neutral-700">Alex (Candidate)</span>
                <button
                  onClick={() => loginAsMockUser('alex@gmail.com')}
                  className="text-neutral-900 font-semibold hover:underline bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-sm cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
