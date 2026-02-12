
import React, { useState } from 'react';
import { UserRole, Employee } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: Employee;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);

  // Navigation links for each role
  const adminLinks = ['Overview', 'Register Patient', 'Patient List', 'Discharged Patients', 'ER Management'];
  const doctorLinks = ['My Patients', 'Surgeries', 'OR Management'];
  const nurseLinks = ['Assigned Patients', 'Patient Schedule'];
  const diagLinks = ['Assigned Tests', 'Pending Reports', 'Completed'];
  const pharmLinks = ['Pending Orders', 'Dispensed List', 'Inventory'];

  const getLinks = () => {
    switch (user.role) {
      case UserRole.ADMIN: return adminLinks;
      case UserRole.DOCTOR: return doctorLinks;
      case UserRole.NURSE: return nurseLinks;
      case UserRole.DIAGNOSTIC: return diagLinks;
      case UserRole.PHARMACY: return pharmLinks;
      default: return [];
    }
  };

  const userInitials = user.full_name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-20 relative">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" /></svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">HOSPITAL</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role} Console</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {getLinks().map(link => (
          <button
            key={link}
            onClick={() => setActiveTab(link)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
              activeTab === link ? 'bg-blue-600/10 text-blue-400 font-semibold' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === link ? (link === 'ER Management' ? 'bg-red-500' : 'bg-blue-500') : 'bg-transparent'}`}></span>
            <span className={link === 'ER Management' && activeTab !== link ? 'text-red-400 font-bold' : ''}>{link}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2 relative">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" /></svg>
          <span className="font-medium">Logout</span>
        </button>

        <button 
          onClick={() => setShowProfile(true)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-all text-left"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user.full_name}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{user.role}</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" /></svg>
        </button>

        {showProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-slate-800">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100">
                  {userInitials}
                </div>
                <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-lg font-black text-slate-800">{user.full_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Role</p>
                    <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight">
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</p>
                    <p className="text-sm font-bold text-slate-700">{user.department}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-medium text-blue-600 underline">{user.email}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setShowProfile(false)}
                  className="w-full bg-slate-800 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-slate-900 transition-all"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
