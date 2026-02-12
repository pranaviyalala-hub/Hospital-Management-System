
import React, { useState, useEffect } from 'react';
import { Urgency } from '../../types';

interface OrderProps {
  onSubmit: (data: any) => void;
  allergies: string;
}

const PrescriptionOrder: React.FC<OrderProps> = ({ onSubmit, allergies }) => {
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Twice a day');
  const [urgency, setUrgency] = useState(Urgency.NORMAL);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (medicine && allergies.toLowerCase().includes(medicine.toLowerCase())) {
      setWarning(`DRUG CONFLICT: Patient is allergic to ${medicine}!`);
    } else {
      setWarning(null);
    }
  }, [medicine, allergies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      medicine_name: medicine,
      dosage,
      frequency,
      urgency,
      duration: 5,
      instructions: "After meals",
      times: ['08:00', '20:00']
    });
    setMedicine('');
    setDosage('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="font-bold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" /></svg>
        New Prescription
      </h3>
      
      {warning && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 flex items-center animate-pulse">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" /></svg>
          {warning}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Medicine Name</label>
          <input 
            value={medicine} 
            onChange={e => setMedicine(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="e.g. Paracetamol"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Dosage</label>
            <input 
              value={dosage} 
              onChange={e => setDosage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="500mg"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Frequency</label>
            <select 
              value={frequency} 
              onChange={e => setFrequency(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Once a day</option>
              <option>Twice a day</option>
              <option>Thrice a day</option>
              <option>Every 4 hours</option>
            </select>
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
                className={`flex-1 py-1 rounded-md text-xs font-bold border transition-all ${
                  urgency === u ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700">
          Sign & Dispatch to Pharmacy
        </button>
      </form>
    </div>
  );
};

export default PrescriptionOrder;
