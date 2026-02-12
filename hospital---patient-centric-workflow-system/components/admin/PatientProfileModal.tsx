
import React from 'react';
// Fix: removed ICONS from types import as it is not defined in types.ts
import { Patient, Employee, Urgency, PatientStatus } from '../../types';
import { ICONS as SharedIcons } from '../../constants';

interface ProfileModalProps {
  patient: Patient;
  employees: Employee[];
  onClose: () => void;
}

const PatientProfileModal: React.FC<ProfileModalProps> = ({ patient, employees, onClose }) => {
  const getEmployee = (id?: string) => employees.find(e => e.employee_id === id);

  const team = [
    { role: 'Doctor', emp: getEmployee(patient.assigned_doctor_id), icon: SharedIcons.Doctor },
    { role: 'Nurse', emp: getEmployee(patient.assigned_nurse_id), icon: SharedIcons.Nurse },
    { role: 'Diagnostic', emp: getEmployee(patient.assigned_diag_id), icon: SharedIcons.Diagnostic },
    { role: 'Pharmacy', emp: getEmployee(patient.assigned_pharm_id), icon: SharedIcons.Pharmacy },
    { role: 'Admin', emp: getEmployee(patient.assigned_admin_id), icon: SharedIcons.Admin },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                patient.priority === Urgency.CRITICAL ? 'bg-red-500' : 'bg-blue-500 border border-blue-400'
              }`}>
                {patient.priority} Priority
              </span>
              <span className="text-blue-200 text-xs font-mono font-bold">PID #{patient.patient_id.toString().padStart(4, '0')}</span>
            </div>
            <h2 className="text-3xl font-black">{patient.patient_name}</h2>
            <p className="text-blue-100 mt-1">{patient.age} Years • {patient.gender} • Status: <span className="font-bold underline">{patient.status}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vitals Column */}
          <div className="md:col-span-1 space-y-6">
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Current Vitals</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                  <p className="text-lg font-black text-slate-700">{patient.bp}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Temp (°C)</p>
                  <p className="text-lg font-black text-slate-700">{patient.temperature_c}°</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Height</p>
                  <p className="text-lg font-black text-slate-700">{patient.height_cm} cm</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Weight</p>
                  <p className="text-lg font-black text-slate-700">{patient.weight_kg} kg</p>
                </div>
              </div>
            </section>

            <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
              <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Known Allergies</h3>
              <p className="text-red-700 font-bold">{patient.allergies || 'No known allergies reported'}</p>
            </section>
            
            <section className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
              <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-2">Blood Group</h3>
              <p className="text-2xl font-black text-teal-700">{patient.blood_group}</p>
            </section>
          </div>

          {/* Care Team Column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Care Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.map((member, idx) => (
                <div key={idx} className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <member.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{member.role}</p>
                    <p className="font-bold text-slate-800">{member.emp?.full_name || 'Processing...'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{member.emp?.designation || member.emp?.department}</p>
                  </div>
                </div>
              ))}
            </div>

            <section className="mt-8 pt-8 border-t">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Registration Metadata</h3>
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <p className="text-slate-400">Admitted On</p>
                  <p className="font-bold">{new Date(patient.registration_datetime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Time of Admission</p>
                  <p className="font-bold">{new Date(patient.registration_datetime).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Registration Staff</p>
                  <p className="font-bold text-blue-600">{getEmployee(patient.assigned_admin_id)?.full_name || 'System'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
