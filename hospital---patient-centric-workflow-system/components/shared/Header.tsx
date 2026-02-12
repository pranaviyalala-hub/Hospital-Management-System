
import React from 'react';
import { Employee } from '../../types';

interface HeaderProps {
  user: Employee;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center space-x-4">
        <div className="bg-slate-100 px-3 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Persistent</span>
        </div>
        <div className="hidden md:flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l pl-4">
          <svg className="w-3 h-3 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 4.477 4 10 4s10-1.79 10-4V7M4 7c0 2.21 4.477 4 10 4s10-1.79 10-4M4 7c0-2.21 4.477-4 10-4s10 1.79 10 4m0 5c0 2.21-4.477 4-10 4s-10-1.79-10-4" strokeWidth="2.5" /></svg>
          Cloud DB Active
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" /></svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
