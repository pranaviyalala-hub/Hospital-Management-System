
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Patient, Employee, Urgency, PatientStatus, ORRoom, ORRequest } from '../types';
import Sidebar from './shared/Sidebar';
import Header from './shared/Header';
import StatsCard from './shared/StatsCard';
import PatientRegistrationForm from './admin/PatientRegistrationForm';
import PatientProfileModal from './admin/PatientProfileModal';

interface AdminDashboardProps {
  user: Employee;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  employees: Employee[];
  ors: ORRoom[];
  setOrs: React.Dispatch<React.SetStateAction<ORRoom[]>>;
  orRequests: ORRequest[];
  setOrRequests: React.Dispatch<React.SetStateAction<ORRequest[]>>;
  addEvent: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, patients, setPatients, employees, ors, setOrs, orRequests, setOrRequests, addEvent, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedProfilePatient, setSelectedProfilePatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ER Management Specific State
  const [erPatientName, setErPatientName] = useState('');
  const [emergencyBookingPatient, setEmergencyBookingPatient] = useState<Patient | null>(null);
  const [viewingTeamPatient, setViewingTeamPatient] = useState<Patient | null>(null);

  const stats = [
    { label: 'Total Patients', value: patients.length, color: 'blue' },
    { label: 'Active Cases', value: patients.filter(p => p.status !== PatientStatus.DISCHARGED).length, color: 'teal' },
    { label: 'Critical Cases', value: patients.filter(p => p.priority === Urgency.CRITICAL).length, color: 'red' },
    { label: 'Available ORs', value: ors.filter(o => o.status === 'Available').length, color: 'green' },
  ];

  const filteredActivePatients = useMemo(() => {
    return patients
      .filter(p => p.status !== PatientStatus.DISCHARGED)
      .filter(p => 
        p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patient_id.toString().includes(searchTerm)
      );
  }, [patients, searchTerm]);

  const dischargedPatientsList = useMemo(() => {
    return patients
      .filter(p => p.status === PatientStatus.DISCHARGED)
      .filter(p => 
        p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patient_id.toString().includes(searchTerm)
      );
  }, [patients, searchTerm]);

  const handleEmergencyAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erPatientName.trim()) return;

    const getRandom = (role: UserRole) => {
      const staff = employees.filter(e => e.role === role);
      return staff[Math.floor(Math.random() * staff.length)];
    };

    const doc = getRandom(UserRole.DOCTOR);
    const nurse = getRandom(UserRole.NURSE);
    const diag = getRandom(UserRole.DIAGNOSTIC);
    const pharm = getRandom(UserRole.PHARMACY);

    const newPatient: Patient = {
      patient_id: patients.length + 1,
      patient_name: erPatientName,
      age: 0, 
      gender: 'Other',
      height_cm: 0,
      weight_kg: 0,
      temperature_c: 37,
      blood_group: 'Unknown',
      bp: 'N/A',
      allergies: 'None reported (Emergency)',
      priority: Urgency.CRITICAL,
      status: PatientStatus.ADMITTED,
      registration_datetime: new Date().toISOString(),
      assigned_doctor_id: doc.employee_id,
      assigned_nurse_id: nurse.employee_id,
      assigned_diag_id: diag.employee_id,
      assigned_pharm_id: pharm.employee_id,
      assigned_admin_id: user.employee_id,
    };

    setPatients(prev => [...prev, newPatient]);
    setErPatientName('');

    addEvent({
      patient_id: newPatient.patient_id,
      title: 'EMERGENCY ADMISSION',
      description: `ATTENTION: Dr. ${doc.full_name}, Nurse ${nurse.full_name}, Diag ${diag.full_name}, and Pharm ${pharm.full_name}. Emergency case "${newPatient.patient_name}" admitted. Immediate care team activation required.`,
      type: 'registration',
      urgency: Urgency.CRITICAL,
      actor: user.full_name,
    });
  };

  const handleEmergencyORBook = (orId: string) => {
    if (!emergencyBookingPatient) return;

    setOrs(prev => prev.map(or => 
      or.id === orId ? { ...or, status: 'In Surgery', current_patient_id: emergencyBookingPatient.patient_id } : or
    ));

    setPatients(prev => prev.map(p => 
      p.patient_id === emergencyBookingPatient.patient_id ? { ...p, status: PatientStatus.IN_SURGERY } : p
    ));

    const doc = employees.find(e => e.employee_id === emergencyBookingPatient.assigned_doctor_id);
    const nurse = employees.find(e => e.employee_id === emergencyBookingPatient.assigned_nurse_id);

    addEvent({
      patient_id: emergencyBookingPatient.patient_id,
      title: 'OR ALLOCATED (EMERGENCY)',
      description: `IMPORTANT: Dr. ${doc?.full_name} and Nurse ${nurse?.full_name}. OR unit "${orId}" has been cleared and booked for emergency surgery for ${emergencyBookingPatient.patient_name}. Patient being moved now.`,
      type: 'surgery',
      urgency: Urgency.CRITICAL,
      actor: user.full_name,
    });

    setEmergencyBookingPatient(null);
  };

  const handleRegisterPatient = (newPatient: Omit<Patient, 'patient_id' | 'registration_datetime'>) => {
    const patient: Patient = {
      ...newPatient,
      patient_id: patients.length + 1,
      registration_datetime: new Date().toISOString(),
      assigned_admin_id: user.employee_id,
    };
    setPatients(prev => [...prev, patient]);
    addEvent({
      patient_id: patient.patient_id,
      title: 'Patient Registered',
      description: `New patient ${patient.patient_name} admitted. Team assigned.`,
      type: 'registration',
      urgency: patient.priority,
      actor: user.full_name,
    });
    setActiveTab('Patient List'); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(stat => <StatsCard key={stat.label} {...stat} />)}
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Hospital Activity Center</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrative Oversight Panel</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    The Administrative Dashboard provides high-level metrics on patient occupancy, urgency levels, and facility availability. 
                    Surgical schedules and Operating Room control are managed exclusively by the clinical teams through the Doctor's Portal.
                  </p>
                  <div className="flex space-x-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Status</p>
                      <p className="text-sm font-bold text-slate-700">All Departments Optimal</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</p>
                      <p className="text-sm font-bold text-green-600">Stable & Persistent</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Operational Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">Total Clinical Staff</span>
                      <span className="text-sm font-black">{employees.length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">Total Admitted</span>
                      <span className="text-sm font-black">{patients.filter(p => p.status !== PatientStatus.DISCHARGED).length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">Active ER Cases</span>
                      <span className="text-sm font-black text-red-400">{patients.filter(p => p.priority === Urgency.CRITICAL && p.status !== PatientStatus.DISCHARGED).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ER Management':
        const criticalPatients = patients.filter(p => p.priority === Urgency.CRITICAL && p.status !== PatientStatus.DISCHARGED);
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white border-2 border-red-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5" /></svg>
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Quick ER Admission</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immediate Team Activation</p>
                </div>
              </div>
              <form onSubmit={handleEmergencyAdmit} className="flex gap-2">
                <input 
                  autoFocus
                  className="flex-1 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Patient Full Name..."
                  value={erPatientName}
                  onChange={(e) => setErPatientName(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-red-700 active:scale-95 transition-all shrink-0"
                >
                  Admit Now
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">Active Emergency Queue</h3>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-red-200">{criticalPatients.length} Active</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border-b">
                    <tr>
                      <th className="px-5 py-3">Patient Details</th>
                      <th className="px-5 py-3">Current Status</th>
                      <th className="px-5 py-3 text-right">Emergency Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {criticalPatients.length > 0 ? criticalPatients.map(p => (
                      <tr key={p.patient_id} className="hover:bg-red-50/20 transition-colors group">
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black">
                              {p.patient_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{p.patient_name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">PID: #{p.patient_id.toString().padStart(3, '0')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${
                            p.status === PatientStatus.IN_SURGERY ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            <span className={`w-1 h-1 rounded-full mr-1.5 ${p.status === PatientStatus.IN_SURGERY ? 'bg-white' : 'bg-amber-500'}`}></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end items-center space-x-2">
                             <button 
                              onClick={() => setViewingTeamPatient(p)}
                              className="text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
                            >
                              Team Report
                            </button>
                            {p.status !== PatientStatus.IN_SURGERY && (
                              <button 
                                onClick={() => setEmergencyBookingPatient(p)}
                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-700 transition-all"
                              >
                                Book OR
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-slate-300 italic font-medium">No critical emergencies in queue.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Register Patient':
        return (
          <div className="bg-white rounded-2xl shadow-sm border p-6 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Patient Registration</h2>
            </div>
            <PatientRegistrationForm onSubmit={handleRegisterPatient} employees={employees} />
          </div>
        );

      case 'Patient List':
        return (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Active In-Patient Management</h2>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search Active..." 
                  className="px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Patient ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Assigned Doctor</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Admitted On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredActivePatients.length > 0 ? filteredActivePatients.map(patient => (
                    <tr key={patient.patient_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">#{patient.patient_id.toString().padStart(3, '0')}</td>
                      <td className="px-6 py-4 font-medium">{patient.patient_name}</td>
                      <td className="px-6 py-4">{employees.find(e => e.employee_id === patient.assigned_doctor_id)?.full_name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          patient.priority === Urgency.CRITICAL ? 'bg-red-100 text-red-700' :
                          patient.priority === Urgency.HIGH ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 bg-blue-500 animate-pulse`}></span>
                          {patient.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{new Date(patient.registration_datetime).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedProfilePatient(patient)}
                          className="text-blue-600 hover:text-blue-800 font-black tracking-tight uppercase text-xs"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                        No active patients found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Discharged Patients':
        return (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Discharged Records</h2>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search Discharged..." 
                  className="px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Age/Gen</th>
                    <th className="px-6 py-4">Primary Physician</th>
                    <th className="px-6 py-4">Admission Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {dischargedPatientsList.length > 0 ? dischargedPatientsList.map(patient => (
                    <tr key={patient.patient_id} className="hover:bg-slate-50 transition-colors opacity-75">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">#{patient.patient_id}</td>
                      <td className="px-6 py-4 font-bold">{patient.patient_name}</td>
                      <td className="px-6 py-4 text-slate-500">{patient.age} / {patient.gender.charAt(0)}</td>
                      <td className="px-6 py-4">{employees.find(e => e.employee_id === patient.assigned_doctor_id)?.full_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(patient.registration_datetime).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight">Discharged</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedProfilePatient(patient)}
                          className="text-slate-400 hover:text-slate-600 font-black uppercase tracking-tight text-[10px]"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">No discharged records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === 'Overview' ? 'Hospital Command Center' : activeTab}
              </h1>
              {activeTab !== 'Register Patient' && activeTab !== 'ER Management' && (
                <button 
                  onClick={() => setActiveTab('Register Patient')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" /></svg>
                  Quick Register
                </button>
              )}
            </div>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* View Team Modal */}
      {viewingTeamPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Care Team Report</h3>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Assigned for {viewingTeamPatient.patient_name}</p>
              </div>
              <button onClick={() => setViewingTeamPatient(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Primary Physician', id: viewingTeamPatient.assigned_doctor_id },
                { label: 'Lead Nurse', id: viewingTeamPatient.assigned_nurse_id },
                { label: 'Diagnostic Staff', id: viewingTeamPatient.assigned_diag_id },
                { label: 'Pharmacy Lead', id: viewingTeamPatient.assigned_pharm_id },
                { label: 'Admitting Admin', id: viewingTeamPatient.assigned_admin_id }
              ].map((role, idx) => {
                const staff = employees.find(e => e.employee_id === role.id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role.label}</p>
                      <p className="text-sm font-black text-slate-800">{staff?.full_name || 'N/A'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => setViewingTeamPatient(null)}
              className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-100"
            >
              Close Team View
            </button>
          </div>
        </div>
      )}

      {/* Emergency OR Booking Modal */}
      {emergencyBookingPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-10 max-w-4xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-red-500 font-black uppercase tracking-widest text-[10px]">Critical Allocation</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Emergency OR Assignment</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Allocating space for <b>{emergencyBookingPatient.patient_name}</b></p>
              </div>
              <button onClick={() => setEmergencyBookingPatient(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ors.map(or => (
                <button
                  key={or.id}
                  disabled={or.status !== 'Available'}
                  onClick={() => handleEmergencyORBook(or.id)}
                  className={`p-6 rounded-3xl border-4 text-left transition-all ${
                    or.status === 'Available' ? 'bg-white border-green-100 hover:border-red-500 hover:shadow-red-50 group' : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                   <h4 className="text-2xl font-black text-slate-800 mb-1">{or.name}</h4>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${or.status === 'Available' ? 'text-green-600' : 'text-slate-400'}`}>
                    {or.status}
                   </p>
                   {or.status === 'Available' && <div className="bg-green-500 text-white py-1 px-3 rounded-lg text-[10px] font-black uppercase text-center group-hover:bg-red-600">Book Now</div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedProfilePatient && (
        <PatientProfileModal patient={selectedProfilePatient} employees={employees} onClose={() => setSelectedProfilePatient(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
