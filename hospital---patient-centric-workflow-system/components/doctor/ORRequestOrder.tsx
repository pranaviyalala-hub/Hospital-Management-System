
import React, { useState, useEffect } from 'react';
import { Urgency } from '../../types';

interface OrderProps {
  onSubmit: (data: any) => void;
  registrationDate?: string;
}

const ORRequestOrder: React.FC<OrderProps> = ({ onSubmit, registrationDate }) => {
  const [surgeryName, setSurgeryName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [urgency, setUrgency] = useState(Urgency.NORMAL);

  // Calculate minimum allowed date string (YYYY-MM-DD)
  const minDate = registrationDate 
    ? new Date(registrationDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  // If registration date is today, we should also consider restricting the time, 
  // but standard HTML5 time inputs are hard to restrict relative to a specific day's hour.
  // For simplicity and ERP behavior, we restrict the Date selection.

  useEffect(() => {
    // If the currently selected date is earlier than the registration date, reset it
    if (date && registrationDate && date < minDate) {
      setDate(minDate);
    }
  }, [registrationDate, date, minDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgeryName.trim() || !date) return;
    
    onSubmit({
      surgery_name: surgeryName,
      date,
      time,
      duration,
      urgency,
    });
    
    // Reset fields
    setSurgeryName('');
    setDate('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="font-bold mb-4 flex items-center text-rose-600">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.562 1.488l-4.535.907a2 2 0 01-2.261-1.282l-1.01-3.03a2 2 0 01.353-1.878l2.446-3.263a2 2 0 00.32-2.129L5.93 5.432a2 2 0 00-1.745-1.164H3.43a2 2 0 00-2 2V12a10 10 0 0010 10h1.57a2 2 0 002-1.22l1.284-3.851a2 2 0 011.647-1.373l3.528-.441a2 2 0 001.769-1.987V15.7a2 2 0 00-.572-1.414z" strokeWidth="2" />
        </svg>
        Request OR / Surgery
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Surgery Name</label>
          <input 
            value={surgeryName} 
            onChange={e => setSurgeryName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none mt-1" 
            placeholder="e.g. Appendectomy"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Date (Min: {minDate})</label>
            <input 
              type="date"
              min={minDate}
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none mt-1" 
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Duration (Min)</label>
            <input 
              type="number"
              value={duration} 
              onChange={e => setDuration(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none mt-1" 
              placeholder="60"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Priority</label>
          <div className="flex gap-2 mt-1">
            {Object.values(Urgency).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                className={`flex-1 py-1 rounded-md text-[10px] font-bold border transition-all uppercase tracking-tighter ${
                  urgency === u ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-rose-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all mt-2">
          Request Booking
        </button>
      </form>
    </div>
  );
};

export default ORRequestOrder;
