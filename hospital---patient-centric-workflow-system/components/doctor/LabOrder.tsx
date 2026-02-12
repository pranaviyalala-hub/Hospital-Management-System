
import React, { useState } from 'react';
import { Urgency } from '../../types';

interface OrderProps {
  onSubmit: (data: any) => void;
}

const LabOrder: React.FC<OrderProps> = ({ onSubmit }) => {
  const [test, setTest] = useState('Blood Test (CBC)');
  const [priority, setPriority] = useState(Urgency.NORMAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      test_name: test,
      priority,
      scheduled_datetime: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="font-bold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.562 1.488l-4.535.907a2 2 0 01-2.261-1.282l-1.01-3.03a2 2 0 01.353-1.878l2.446-3.263a2 2 0 00.32-2.129L5.93 5.432a2 2 0 00-1.745-1.164H3.43a2 2 0 00-2 2V12a10 10 0 0010 10h1.57a2 2 0 002-1.22l1.284-3.851a2 2 0 011.647-1.373l3.528-.441a2 2 0 001.769-1.987V15.7a2 2 0 00-.572-1.414z" strokeWidth="2" /></svg>
        Diagnostic Order
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Select Test Type</label>
          <select 
            value={test} 
            onChange={e => setTest(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none mt-1"
          >
            <option>Blood Test (CBC)</option>
            <option>CT Scan - Chest</option>
            <option>MRI - Brain</option>
            <option>X-Ray - Abdomen</option>
            <option>Ultrasound</option>
            <option>ECG / EKG</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 uppercase font-bold">Priority</label>
          <div className="flex gap-2 mt-1">
            {Object.values(Urgency).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setPriority(u)}
                className={`flex-1 py-1 rounded-md text-xs font-bold border transition-all ${
                  priority === u ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-teal-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-teal-700">
            Request Lab Investigation
          </button>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Automatically routes to the assigned Diagnostic technician.</p>
        </div>
      </form>
    </div>
  );
};

export default LabOrder;
