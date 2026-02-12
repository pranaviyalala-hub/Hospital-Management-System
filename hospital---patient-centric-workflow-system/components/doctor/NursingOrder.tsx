
import React, { useState } from 'react';
import { Urgency } from '../../types';

interface OrderProps {
  onSubmit: (data: any) => void;
}

const NursingOrder: React.FC<OrderProps> = ({ onSubmit }) => {
  const [careInstruction, setCareInstruction] = useState('');
  const [urgency, setUrgency] = useState(Urgency.NORMAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careInstruction.trim()) return;
    
    onSubmit({
      care_instruction: careInstruction,
      urgency,
    });
    setCareInstruction('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border col-span-1 md:col-span-2">
      <h3 className="font-bold mb-4 flex items-center text-indigo-600">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" /></svg>
        Clinical Instruction to Nurse
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Nursing Care:</label>
          <textarea 
            value={careInstruction} 
            onChange={e => setCareInstruction(e.target.value)}
            className="w-full border-2 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mt-1 min-h-[100px] bg-slate-50 font-medium" 
            placeholder="Describe specific care steps, patient positioning, wound care details, or mobility restrictions..."
            required
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {Object.values(Urgency).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  urgency === u 
                    ? u === Urgency.CRITICAL ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' : 
                      u === Urgency.HIGH ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' : 
                      'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          
          <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest">
            Send Care Instruction
          </button>
        </div>
      </form>
    </div>
  );
};

export default NursingOrder;
