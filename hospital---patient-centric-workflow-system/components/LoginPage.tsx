
import React, { useState } from 'react';
import { UserRole, Employee } from '../types';
import { ICONS, COLORS } from '../constants';

interface LoginPageProps {
  onLogin: (user: Employee) => void;
  employees: Employee[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, employees }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const roles = Object.values(UserRole);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = employees.find(emp => 
      emp.email.toLowerCase() === email.toLowerCase() && 
      emp.role === selectedRole
    );
    
    if (!user) {
      setError("Email not found for selected role. Please check your details.");
      return;
    }

    if (user.password !== password) {
      setError("Invalid password. Please try again.");
      return;
    }

    if (!user.is_active) {
      setError("This account has been deactivated. Please contact administration.");
      return;
    }

    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
        <div className="p-8 bg-blue-600 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold">HOSPITAL</h1>
          <p className="text-blue-100 text-sm mt-1">Clinical Workflow System</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 uppercase tracking-tight">Select Access Gateway</h2>
              <div className="grid grid-cols-1 gap-3">
                {roles.map(role => {
                  const Icon = ICONS[role as keyof typeof ICONS];
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="flex items-center p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group text-left"
                    >
                      <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100">
                        <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <span className="block font-bold text-slate-700">{role}</span>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Login Portal</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="flex items-center mb-6">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" /></svg>
                </button>
                <div className="ml-2">
                  <h2 className="text-xl font-bold text-slate-800">Identity Verification</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase">Role: {selectedRole}</p>
                </div>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 font-bold">{error}</div>}

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. doctor1@hospital.local"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Secure Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth="2" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-slate-500 font-bold">
                  <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Trust this station
                </label>
                <button type="button" className="text-blue-600 hover:underline font-bold">Forgot password?</button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Authenticate & Enter
              </button>
            </form>
          )}
        </div>
      </div>
      <p className="fixed bottom-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Institutional Secure Access • Terminal Node Beta v2.4</p>
    </div>
  );
};

export default LoginPage;
