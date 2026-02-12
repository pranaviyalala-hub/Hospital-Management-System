
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color }) => {
  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-600',
    teal: 'bg-teal-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center group hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center text-white mr-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="2" /></svg>
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
