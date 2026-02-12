
import React, { useState } from 'react';
import { UserRole, Patient, Employee, TimelineEvent, Urgency, Prescription, DiagnosticTest, NursingInstruction, ORRequest, PatientStatus, ORRoom } from '../types';
import Sidebar from './shared/Sidebar';
import Header from './shared/Header';
import Timeline from './shared/Timeline';
import PrescriptionOrder from './doctor/PrescriptionOrder';
import LabOrder from './doctor/LabOrder';
import NursingOrder from './doctor/NursingOrder';
import ORRequestOrder from './doctor/ORRequestOrder';

interface DoctorDashboardProps {
  user: Employee;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  timeline: TimelineEvent[];
  addEvent: any;
  onLogout: () => void;
  prescriptions: Prescription[];
  setPrescriptions: any;
  tests: DiagnosticTest[];
  setTests: any;
  nursingInstructions: NursingInstruction[];
  setNursingInstructions: any;
  orRequests: ORRequest[];
  setOrRequests: any;
  ors: ORRoom[];
  setOrs: React.Dispatch<React.SetStateAction<ORRoom[]>>;
  employees: Employee[];
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ 
  user, patients, setPatients, timeline, addEvent, onLogout, prescriptions, setPrescriptions, tests, setTests, nursingInstructions, setNursingInstructions, orRequests, setOrRequests,
  ors, setOrs, employees
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('My Patients');
  const [viewingReport, setViewingReport] = useState<TimelineEvent | null>(null);
  
  // OR Management State (Moved from Admin)
  const [assignmentOR, setAssignmentOR] = useState<string | null>(null);
  const [manageOR, setManageOR] = useState<ORRoom | null>(null);
  const [assignData, setAssignData] = useState({
    patientId: '',
    date: '',
    time: '09:00',
    surgeryName: ''
  });

  const myPatients = patients.filter(p => p.assigned_doctor_id === user.employee_id && p.status !== PatientStatus.DISCHARGED);
  const mySurgeries = orRequests.filter(req => req.doctor_id === user.employee_id);

  const handleOrderPrescription = (order: any) => {
    if (!selectedPatient) return;
    const newOrder: Prescription = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.patient_id,
      ...order,
      status: 'Pending',
      adherence: {}
    };
    setPrescriptions((prev: any) => [...prev, newOrder]);
    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'Prescription Ordered',
      description: `Doctor ${user.full_name} prescribed ${order.medicine_name}. Pharmacist and Nurse notified.`,
      type: 'prescription',
      urgency: order.urgency,
      actor: user.full_name,
    });
  };

  const handleOrderLab = (order: any) => {
    if (!selectedPatient) return;
    const newTest: DiagnosticTest = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.patient_id,
      ...order,
      status: 'Pending',
    };
    setTests((prev: any) => [...prev, newTest]);
    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'Lab Request',
      description: `New diagnostic request: ${order.test_name}. Lab team notified.`,
      type: 'diagnostic',
      urgency: order.priority,
      actor: user.full_name,
    });
  };

  const handleOrderNursing = (order: any) => {
    if (!selectedPatient) return;
    const newInstruction: NursingInstruction = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.patient_id,
      care_instruction: order.care_instruction,
      urgency: order.urgency,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      doctor_name: user.full_name,
    };
    setNursingInstructions((prev: any) => [...prev, newInstruction]);
    
    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'Nursing Care Instruction',
      description: `Nursing Care: ${order.care_instruction}. Assigned Nurse notified. Diagnostic and Pharmacy staff alerted.`,
      type: 'nursing',
      urgency: order.urgency,
      actor: user.full_name,
    });
  };

  const handleRequestOR = (order: any) => {
    if (!selectedPatient) return;
    const newRequest: ORRequest = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.patient_id,
      doctor_id: user.employee_id,
      doctor_name: user.full_name,
      surgery_name: order.surgery_name,
      date: order.date,
      time: order.time,
      duration: parseInt(order.duration),
      urgency: order.urgency,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setOrRequests((prev: ORRequest[]) => [...prev, newRequest]);
    addEvent({
      patient_id: selectedPatient.patient_id,
      title: 'OR Booking Requested',
      description: `Surgery requested: ${order.surgery_name} for ${order.date} at ${order.time}. Request sent to Administration.`,
      type: 'surgery',
      urgency: order.urgency,
      actor: user.full_name,
    });
  };

  const handleDischargePatient = (patientId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const p = patients.find(p => p.patient_id === patientId);
    if (!p) return;

    setPatients(prev => prev.map(p => 
      p.patient_id === patientId ? { ...p, status: PatientStatus.DISCHARGED } : p
    ));

    addEvent({
      patient_id: patientId,
      title: 'Patient Discharged',
      description: `Doctor ${user.full_name} has authorized discharge for ${p.patient_name}. Final billing and clearance initiated.`,
      type: 'status',
      urgency: Urgency.NORMAL,
      actor: user.full_name,
    });

    if (selectedPatient?.patient_id === patientId) {
      setSelectedPatient(null);
    }
  };

  // OR Logic
  const handleUpdateORStatus = (orId: string, nextStatus: ORRoom['status']) => {
    const targetOR = ors.find(o => o.id === orId);
    if (!targetOR) return;
    const pId = targetOR.current_patient_id;

    setOrs(prev => prev.map(or => (or.id === orId ? { ...or, status: nextStatus, current_patient_id: nextStatus === 'Available' ? undefined : or.current_patient_id } : or)));

    if (pId) {
      let newPStatus = PatientStatus.ADMITTED;
      if (nextStatus === 'Booked') newPStatus = PatientStatus.SURGERY_SCHEDULED;
      if (nextStatus === 'In Surgery') newPStatus = PatientStatus.IN_SURGERY;
      
      setPatients(prev => prev.map(p => p.patient_id === pId ? { ...p, status: newPStatus } : p));

      if (nextStatus === 'Available') {
        setOrRequests(prev => prev.map(req => (req.patient_id === pId && req.status === 'Approved') ? { ...req, status: 'Completed' } : req));
        addEvent({
          patient_id: pId,
          title: 'Surgery Completed',
          description: `The surgical procedure has finished and the patient has returned to the ward. OR ${orId} is now being cleaned.`,
          type: 'surgery',
          urgency: Urgency.NORMAL,
          actor: user.full_name,
        });
      }
    }
    setManageOR(null);
  };

  const handleConfirmAssignment = (orId: string) => {
    if (!assignData.patientId || !assignData.date) return;
    const pId = parseInt(assignData.patientId);
    
    setOrs(prev => prev.map(or => or.id === orId ? { ...or, status: 'Booked' as const, current_patient_id: pId } : or));
    setPatients(prev => prev.map(p => p.patient_id === pId ? { ...p, status: PatientStatus.SURGERY_SCHEDULED } : p));

    const associatedRequest = orRequests.find(r => r.patient_id === pId && r.status === 'Pending');
    if (associatedRequest) {
      setOrRequests(prev => prev.map(r => r.id === associatedRequest.id ? { ...r, status: 'Approved' } : r));
    }

    addEvent({
      patient_id: pId,
      title: 'Surgery Scheduled',
      description: `Surgery "${assignData.surgeryName || 'Standard Procedure'}" booked in ${orId} for ${assignData.date} at ${assignData.time}.`,
      type: 'surgery',
      urgency: Urgency.HIGH,
      actor: user.full_name,
    });

    setAssignmentOR(null);
    setAssignData({ patientId: '', date: '', time: '09:00', surgeryName: '' });
  };

  const renderReportModal = () => {
    if (!viewingReport) return null;
    const patient = patients.find(p => p.patient_id === viewingReport.patient_id);
    
    const getStaffName = (id?: string) => {
      const staff = employees.find(e => e.employee_id === id);
      return staff ? staff.full_name : 'N/A';
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Clinical Diagnostic Review</h2>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Verified Physician Portal</p>
            </div>
            <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Details</p>
                    <p className="font-bold text-slate-800 text-lg">{patient?.patient_name || 'N/A'}</p>
                    <p className="text-xs text-slate-500">ID: #{patient?.patient_id} • {patient?.age}y • {patient?.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investigation Result</p>
                  <p className="font-bold text-blue-700">{viewingReport.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Report Generated: {new Date(viewingReport.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Care Team</p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Doctor:</span> <span className="font-bold">{getStaffName(patient?.assigned_doctor_id)}</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Nurse:</span> <span className="font-bold">{getStaffName(patient?.assigned_nurse_id)}</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Diagnostic:</span> <span className="font-bold">{getStaffName(patient?.assigned_diag_id)}</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Pharmacy:</span> <span className="font-bold">{getStaffName(patient?.assigned_pharm_id)}</span></div>
                  <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Admin:</span> <span className="font-bold">{getStaffName(patient?.assigned_admin_id)}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight border-b pb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" /></svg>
                Digital Clinical Document
              </h3>
              <div className="aspect-[4/3] w-full bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" /></svg>
                </div>
                <h4 className="font-black text-slate-700 uppercase tracking-tight">CONFIDENTIAL_RESULT_#{viewingReport.id}.pdf</h4>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">Access granted to Dr. {user.full_name}. This document is a secure clinical simulation of the laboratory findings.</p>
                <div className="mt-8 flex space-x-3">
                  <a href={viewingReport.report_url} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">View Document</a>
                  <button className="bg-slate-800 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Print Record</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 border-t flex justify-end">
            <button onClick={() => setViewingReport(null)} className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Close Viewer</button>
          </div>
        </div>
      </div>
    );
  };

  const renderORManagementView = () => {
    const availablePatientsForSurgery = patients.filter(p => p.status === PatientStatus.ADMITTED);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Operating Theater Control Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ors.map(or => {
            const bookedPatient = patients.find(p => p.patient_id === or.current_patient_id);
            const isAssigning = assignmentOR === or.id;
            const selectedPatientObj = assignData.patientId ? patients.find(p => p.patient_id === parseInt(assignData.patientId)) : null;
            const minSurgeryDate = selectedPatientObj ? new Date(selectedPatientObj.registration_datetime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

            return (
              <div key={or.id} className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col min-h-[350px] ${
                or.status === 'Booked' ? 'bg-white border-blue-200 shadow-blue-50' : 
                or.status === 'In Surgery' ? 'bg-red-50/30 border-red-200' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{or.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Surgical Unit</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    or.status === 'Booked' ? 'bg-blue-500 text-white' : 
                    or.status === 'In Surgery' ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'
                  }`}>
                    {or.status}
                  </span>
                </div>
                <div className="flex-1">
                  {(or.status === 'Booked' || or.status === 'In Surgery') ? (
                    <div className={`mt-4 p-4 rounded-2xl border ${or.status === 'In Surgery' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                      <p className={`text-[10px] font-bold uppercase mb-1 text-center border-b pb-1 ${or.status === 'In Surgery' ? 'text-red-400 border-red-100' : 'text-blue-400 border-blue-100'}`}>
                        {or.status === 'In Surgery' ? 'PROCEDURE IN PROGRESS' : 'Current Patient Details'}
                      </p>
                      <p className={`font-black truncate text-lg mt-2 ${or.status === 'In Surgery' ? 'text-red-900' : 'text-blue-900'}`}>
                        {bookedPatient?.patient_name || 'Active Case'}
                      </p>
                      <p className={`text-xs font-medium ${or.status === 'In Surgery' ? 'text-red-700' : 'text-blue-700'}`}>
                        Patient ID: #{or.current_patient_id?.toString().padStart(3, '0')}
                      </p>
                    </div>
                  ) : isAssigning ? (
                    <div className="mt-2 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block">Procedure / Surgery Name</label>
                        <input 
                          placeholder="e.g. Appendectomy"
                          className="w-full text-sm border-2 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-slate-700"
                          value={assignData.surgeryName}
                          onChange={(e) => setAssignData({...assignData, surgeryName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block">Patient Selection</label>
                        <select 
                          className="w-full text-sm border-2 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-slate-700"
                          value={assignData.patientId}
                          onChange={(e) => setAssignData({...assignData, patientId: e.target.value})}
                        >
                          <option value="">Select from Admitted...</option>
                          {availablePatientsForSurgery.map(p => (
                            <option key={p.patient_id} value={p.patient_id}>
                              PID #{p.patient_id.toString().padStart(3, '0')} - {p.patient_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block">Procedure Date</label>
                          <input type="date" min={minSurgeryDate} value={assignData.date} onChange={(e) => setAssignData({...assignData, date: e.target.value})} className="w-full text-sm border-2 rounded-xl px-3 py-2 font-medium" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block">Scheduled Time</label>
                          <input type="time" value={assignData.time} onChange={(e) => setAssignData({...assignData, time: e.target.value})} className="w-full text-sm border-2 rounded-xl px-3 py-2 font-medium" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 p-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center">
                       <svg className="w-10 h-10 text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2" /></svg>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Unit Available</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  {or.status === 'Available' ? (
                    isAssigning ? (
                      <div className="flex space-x-2">
                         <button onClick={() => { setAssignmentOR(null); setAssignData({ patientId: '', date: '', time: '09:00', surgeryName: '' }); }} className="flex-1 py-3 rounded-2xl font-black text-xs bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all uppercase tracking-widest">Cancel</button>
                        <button onClick={() => handleConfirmAssignment(or.id)} disabled={!assignData.patientId || !assignData.date} className="flex-[2] py-3 rounded-2xl font-black text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest shadow-lg shadow-blue-100">Finalize Booking</button>
                      </div>
                    ) : (
                      <button onClick={() => { setAssignmentOR(or.id); setAssignData({ patientId: '', date: '', time: '09:00', surgeryName: '' }); }} className="w-full py-4 rounded-2xl font-black text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all uppercase tracking-widest">Assign Surgery</button>
                    )
                  ) : (
                    <div className="space-y-2">
                      <button onClick={() => setManageOR(or)} className="w-full py-3 rounded-2xl font-black text-sm bg-slate-800 text-white hover:bg-slate-900 transition-all uppercase tracking-widest border-2 border-slate-800">
                        {or.status === 'Booked' ? 'Manage Booking' : 'Manage Surgery'}
                      </button>
                      <button onClick={() => handleUpdateORStatus(or.id, 'Available')} className="w-full py-2.5 rounded-2xl font-black text-[10px] text-red-600 hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100 uppercase tracking-widest">Release Unit (AVAILABLE)</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSurgeriesView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-slate-800">My Surgery Schedule</h2>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {mySurgeries.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Surgery Name</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mySurgeries.map(surgery => {
                const patient = patients.find(p => p.patient_id === surgery.patient_id);
                return (
                  <tr key={surgery.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{surgery.surgery_name}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{patient?.patient_name || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400">PID #{surgery.patient_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{surgery.date}</p>
                      <p className="text-xs text-slate-500">{surgery.time} • {surgery.duration} mins</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        surgery.status === 'Completed' ? 'bg-slate-800 text-white' :
                        surgery.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        surgery.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {surgery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        surgery.urgency === Urgency.CRITICAL ? 'bg-red-500 text-white' : 
                        surgery.urgency === Urgency.HIGH ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {surgery.urgency}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" /></svg>
            <p className="font-bold">No surgeries requested or scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMyPatientsView = () => (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">My Active Patients</h2>
        <div className="space-y-3">
          {myPatients.length > 0 ? myPatients.map(p => (
            <div 
              key={p.patient_id}
              onClick={() => setSelectedPatient(p)}
              className={`w-full group relative text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedPatient?.patient_id === p.patient_id ? 'bg-blue-600 text-white shadow-lg border-blue-600' : 'bg-white hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-bold ${selectedPatient?.patient_id === p.patient_id ? 'text-white' : 'text-slate-800'}`}>{p.patient_name}</p>
                  <p className={`text-xs ${selectedPatient?.patient_id === p.patient_id ? 'text-blue-100' : 'text-slate-500'}`}>ID: #{p.patient_id.toString().padStart(3, '0')} • Age: {p.age}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.priority === Urgency.CRITICAL ? 'bg-red-500 text-white' : p.priority === Urgency.HIGH ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {p.priority}
                  </span>
                  <button 
                    onClick={(e) => handleDischargePatient(p.patient_id, e)}
                    title="Discharge Patient"
                    className={`p-2 rounded-lg transition-colors ${
                      selectedPatient?.patient_id === p.patient_id ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2.5" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-slate-300 border-2 border-dashed rounded-3xl">
              <p className="font-bold uppercase tracking-widest text-xs">No active patients assigned.</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedPatient ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-wrap gap-6 items-center">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{selectedPatient.patient_name}</h2>
                  <button 
                    onClick={(e) => handleDischargePatient(selectedPatient.patient_id, e)}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                  >
                    Confirm Discharge
                  </button>
                </div>
                <p className="text-slate-500">Allergies: <span className="text-red-600 font-bold">{selectedPatient.allergies || 'None'}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-xl">
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">BP</p><p className="font-bold">{selectedPatient.bp}</p></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Temp</p><p className="font-bold">{selectedPatient.temperature_c}°C</p></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PrescriptionOrder onSubmit={handleOrderPrescription} allergies={selectedPatient.allergies} />
              <LabOrder onSubmit={handleOrderLab} />
              <ORRequestOrder onSubmit={handleRequestOR} registrationDate={selectedPatient.registration_datetime} />
              <NursingOrder onSubmit={handleOrderNursing} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Clinical Timeline</h3>
                <div className="flex space-x-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="w-2 h-2 rounded-full bg-slate-200"></span></div>
              </div>
              <Timeline events={timeline.filter(e => e.patient_id === selectedPatient.patient_id)} currentUserRole={UserRole.DOCTOR} onViewReport={(event) => setViewingReport(event)} />
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-inner">
            <svg className="w-20 h-20 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" /></svg>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Select a patient card to manage care</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'My Patients' && renderMyPatientsView()}
            {activeTab === 'Surgeries' && renderSurgeriesView()}
            {activeTab === 'OR Management' && renderORManagementView()}
        </main>
      </div>
      {renderReportModal()}
      
      {/* Manage OR Modal */}
      {manageOR && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black mb-4 text-slate-800 uppercase tracking-tight">OR Unit: {manageOR.name}</h3>
            {manageOR.status === 'Booked' ? (
              <>
                <p className="text-slate-600 mb-6 font-medium text-sm">Initiate surgical procedure for patient <b>#{manageOR.current_patient_id}</b>?</p>
                <button onClick={() => handleUpdateORStatus(manageOR.id, 'In Surgery')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Start Surgery (IN-SURGERY)</button>
              </>
            ) : (
              <button onClick={() => handleUpdateORStatus(manageOR.id, 'Available')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-green-100 hover:bg-green-700 transition-all">Clear & Mark Available</button>
            )}
            <button onClick={() => setManageOR(null)} className="w-full mt-4 py-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
