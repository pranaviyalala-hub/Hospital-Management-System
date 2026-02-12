
import React, { useState, useEffect } from 'react';
import { UserRole, Patient, Employee, TimelineEvent, Urgency, NursingInstruction } from '../types';
import Sidebar from './shared/Sidebar';
import Header from './shared/Header';
import Timeline from './shared/Timeline';

interface NurseDashboardProps {
  user: Employee;
  patients: Patient[];
  setPatients: any;
  timeline: TimelineEvent[];
  addEvent: any;
  onLogout: () => void;
  nursingInstructions: NursingInstruction[];
  setNursingInstructions: any;
}

// Mock scheduled medications for the demo
const MOCK_MEDS = [
  { id: 'm1', name: 'Paracetamol 500mg', time: '08:00', type: 'Oral • Post-Prandial' },
  { id: 'm2', name: 'Amoxicillin 250mg', time: '12:00', type: 'Oral • Pre-Prandial' },
  { id: 'm3', name: 'Insulin Glargine', time: '20:00', type: 'Subcutaneous' },
];

const NurseDashboard: React.FC<NurseDashboardProps> = ({ 
  user, patients, setPatients, timeline, addEvent, onLogout, nursingInstructions, setNursingInstructions 
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('Assigned Patients');
  const [vitals, setVitals] = useState({ bp: '', temp: '' });
  
  // Track administered medications: Record<"patientId_medId", timestamp>
  const [administeredMeds, setAdministeredMeds] = useState<Record<string, number>>({});

  const myPatients = patients.filter(p => p.assigned_nurse_id === user.employee_id);
  const myInstructions = selectedPatient 
    ? nursingInstructions.filter(ni => ni.patient_id === selectedPatient.patient_id)
    : [];

  // Reset timer logic: 3 hours in milliseconds
  const RESET_TIMEOUT = 3 * 60 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setAdministeredMeds(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (now - next[key] >= RESET_TIMEOUT) {
            delete next[key];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updatedBP = vitals.bp || selectedPatient.bp;
    const updatedTemp = parseFloat(vitals.temp) || selectedPatient.temperature_c;

    setPatients((prev: Patient[]) => prev.map(p => 
      p.patient_id === selectedPatient.patient_id 
        ? { ...p, bp: updatedBP, temperature_c: updatedTemp } 
        : p
    ));

    setSelectedPatient(prev => prev ? { ...prev, bp: updatedBP, temperature_c: updatedTemp } : null);

    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'Vitals Logged',
      description: `New Reading - BP: ${updatedBP} | Temp: ${updatedTemp}°C. Recorded by Nurse ${user.full_name}.`,
      type: 'vitals',
      urgency: Urgency.NORMAL,
      actor: user.full_name,
    });

    setVitals({ bp: '', temp: '' });
  };

  const handleCompleteInstruction = (id: string) => {
    setNursingInstructions((prev: NursingInstruction[]) => prev.map(ni => 
      ni.id === id ? { ...ni, status: 'Completed' } : ni
    ));
    
    const instruction = nursingInstructions.find(ni => ni.id === id);
    if (instruction && selectedPatient) {
      addEvent({
        patient_id: selectedPatient.patient_id,
        title: 'Instruction Executed',
        description: `Nursing instruction completed: "${instruction.care_instruction}"`,
        type: 'nursing',
        urgency: Urgency.NORMAL,
        actor: user.full_name,
      });
    }
  };

  const handleAdministerMed = (medId: string, medName: string) => {
    if (!selectedPatient) return;
    const key = `${selectedPatient.patient_id}_${medId}`;
    
    setAdministeredMeds(prev => ({
      ...prev,
      [key]: Date.now()
    }));

    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'Medication Administered',
      description: `Nurse ${user.full_name} administered ${medName}.`,
      type: 'prescription',
      urgency: Urgency.NORMAL,
      actor: user.full_name,
    });
  };

  const renderPatientScheduleView = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border animate-in fade-in duration-300">
      <h3 className="text-lg font-black mb-4 text-slate-800">Global Patient Schedule</h3>
      <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-bold">Consolidated medication rounds for all assigned patients</p>
      
      <div className="space-y-4">
        {myPatients.length > 0 ? myPatients.flatMap(p => MOCK_MEDS.map(med => {
          const key = `${p.patient_id}_${med.id}`;
          const isRecentlyAdministered = !!administeredMeds[key];
          
          return (
            <div key={key} className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${isRecentlyAdministered ? 'bg-slate-50 border-slate-200 opacity-80' : 'hover:bg-slate-50 border-slate-100 shadow-sm'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black transition-colors ${isRecentlyAdministered ? 'bg-slate-200 text-slate-400' : 'bg-teal-100 text-teal-600'}`}>
                  {med.time}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className={`font-black ${isRecentlyAdministered ? 'text-slate-400' : 'text-slate-800'}`}>{med.name}</p>
                    <span className="text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-teal-100">{p.patient_name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{med.type}</p>
                </div>
              </div>
              <button 
                disabled={isRecentlyAdministered}
                onClick={() => {
                  setSelectedPatient(p); // Briefly focus the patient context
                  handleAdministerMed(med.id, med.name);
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isRecentlyAdministered 
                    ? 'bg-slate-200 text-slate-500 cursor-default' 
                    : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white shadow-lg shadow-green-100'
                }`}
              >
                {isRecentlyAdministered ? 'Administered' : 'Administer Now'}
              </button>
            </div>
          );
        })) : (
          <div className="py-20 text-center text-slate-300 border-2 border-dashed rounded-3xl">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" /></svg>
            <p className="font-bold">No active schedule for assigned patients.</p>
          </div>
        )}
      </div>
      <p className="mt-8 text-[10px] text-slate-400 italic text-center uppercase tracking-widest font-bold border-t pt-4">
        Cycle resets automatically every 3 hours for shift rounds simulation
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'Assigned Patients' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Queue */}
                <div className="lg:col-span-1 space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">Nursing Queue</h2>
                  {myPatients.length > 0 ? (
                    <div className="space-y-3">
                      {myPatients.map(p => (
                        <button 
                          key={p.patient_id}
                          onClick={() => setSelectedPatient(p)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all ${
                            selectedPatient?.patient_id === p.patient_id ? 'bg-teal-600 text-white shadow-lg border-teal-600' : 'bg-white shadow-sm hover:border-teal-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{p.patient_name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              p.priority === Urgency.CRITICAL ? 'bg-red-500 text-white' : 'bg-teal-400 text-white'
                            }`}>{p.priority}</span>
                          </div>
                          <p className="text-xs mt-1 opacity-80 font-medium">ID: #{p.patient_id.toString().padStart(3, '0')} • Ward Bed Available</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-3xl text-center text-slate-400 border-2 border-dashed border-slate-100 font-bold italic">No patients currently assigned to you.</div>
                  )}
                </div>

                {/* Right Col: Details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedPatient ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-teal-500">
                        <h3 className="text-xl font-black mb-6 text-slate-800">Care Center: {selectedPatient.patient_name}</h3>
                        
                        <div className="mb-8 space-y-3">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructions from Physician</h4>
                          {myInstructions.length > 0 ? myInstructions.map(ni => (
                            <div key={ni.id} className={`p-4 rounded-2xl border flex justify-between items-start ${ni.status === 'Completed' ? 'bg-slate-50 opacity-60' : 'bg-indigo-50 border-indigo-100 shadow-sm'}`}>
                              <div>
                                <p className={`text-sm font-bold ${ni.status === 'Completed' ? 'line-through text-slate-500' : 'text-indigo-900'}`}>Nursing Care: {ni.care_instruction}</p>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase mt-1">From Dr. {ni.doctor_name} • {new Date(ni.timestamp).toLocaleTimeString()}</p>
                              </div>
                              {ni.status === 'Pending' && (
                                <button 
                                  onClick={() => handleCompleteInstruction(ni.id)}
                                  className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          )) : (
                            <p className="text-sm text-slate-400 italic">No specific clinical instructions provided yet.</p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current BP</p>
                            <p className="text-lg font-black text-slate-700">{selectedPatient.bp}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Temperature</p>
                            <p className="text-lg font-black text-slate-700">{selectedPatient.temperature_c}°C</p>
                          </div>
                          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-tighter">Allergies</p>
                            <p className="text-xs font-black text-red-700 truncate">{selectedPatient.allergies || 'None'}</p>
                          </div>
                        </div>

                        <form onSubmit={handleUpdateVitals} className="space-y-4 pt-6 border-t border-slate-100">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Daily Vitals Observation</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">New BP</label>
                              <input 
                                placeholder="e.g. 118/79" 
                                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium bg-slate-50"
                                value={vitals.bp}
                                onChange={e => setVitals({...vitals, bp: e.target.value})}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">New Temp</label>
                              <input 
                                placeholder="e.g. 37.2" 
                                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium bg-slate-50"
                                value={vitals.temp}
                                onChange={e => setVitals({...vitals, temp: e.target.value})}
                              />
                            </div>
                          </div>
                          <button type="submit" className="bg-teal-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">
                            Commit Vitals Update
                          </button>
                        </form>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-lg font-black mb-6 text-slate-800">Clinical Timeline</h3>
                        <Timeline events={timeline.filter(e => e.patient_id === selectedPatient.patient_id)} />
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-lg font-black mb-4 text-slate-800">Prescribed Medications</h3>
                        <div className="space-y-3">
                          {MOCK_MEDS.map(med => {
                            const key = `${selectedPatient.patient_id}_${med.id}`;
                            const isRecentlyAdministered = !!administeredMeds[key];
                            
                            return (
                              <div key={med.id} className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${isRecentlyAdministered ? 'bg-slate-50 border-slate-200 opacity-80' : 'hover:bg-slate-50 border-slate-100 shadow-sm'}`}>
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${isRecentlyAdministered ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                    {med.time}
                                  </div>
                                  <div>
                                    <p className={`font-black ${isRecentlyAdministered ? 'text-slate-400' : 'text-slate-800'}`}>{med.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{med.type}</p>
                                  </div>
                                </div>
                                <button 
                                  disabled={isRecentlyAdministered}
                                  onClick={() => handleAdministerMed(med.id, med.name)}
                                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isRecentlyAdministered 
                                      ? 'bg-slate-200 text-slate-500 cursor-default' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white shadow-sm'
                                  }`}
                                >
                                  {isRecentlyAdministered ? 'Administered' : 'Administer'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-inner">
                      <svg className="w-20 h-20 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" /></svg>
                      <p className="font-black uppercase tracking-widest text-slate-400">Select a patient to begin care</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              renderPatientScheduleView()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NurseDashboard;
