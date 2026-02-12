
import React, { useState } from 'react';
import { UserRole, Patient, Employee, DiagnosticTest, Urgency } from '../types';
import Sidebar from './shared/Sidebar';
import Header from './shared/Header';

interface DiagDashboardProps {
  user: Employee;
  patients: Patient[];
  tests: DiagnosticTest[];
  setTests: any;
  addEvent: any;
  onLogout: () => void;
  employees: Employee[];
}

const DiagnosticDashboard: React.FC<DiagDashboardProps> = ({ user, patients, tests, setTests, addEvent, onLogout, employees }) => {
  const [activeTab, setActiveTab] = useState('Assigned Tests');
  const [viewingReport, setViewingReport] = useState<DiagnosticTest | null>(null);

  const displayTests = tests.filter(t => {
    if (activeTab === 'Completed') return t.status === 'Completed';
    return t.status !== 'Completed';
  });

  const handleUploadReport = (tId: string, fileName: string) => {
    setTests((prev: DiagnosticTest[]) => prev.map(t => 
      t.id === tId ? { ...t, report_url: `https://hospital.local/reports/${tId}_${fileName}`, status: 'In Progress' } : t
    ));
    
    // Create notification event that a file was uploaded
    const test = tests.find(t => t.id === tId);
    if (test) {
       addEvent({
        patient_id: test.patient_id,
        title: 'Report File Uploaded',
        description: `Lab technician ${user.full_name} uploaded file "${fileName}" for ${test.test_name}.`,
        type: 'diagnostic',
        urgency: Urgency.NORMAL,
        actor: user.full_name,
      });
    }
  };

  const handleComplete = (tId: string) => {
    const test = tests.find(t => t.id === tId);
    if (!test || !test.report_url) return;

    setTests((prev: DiagnosticTest[]) => prev.map(t => t.id === tId ? { ...t, status: 'Completed', technician: user.full_name } : t));
    
    addEvent({
      patient_id: test.patient_id,
      title: 'Lab Report Completed',
      description: `${test.test_name} results available. Marked completed by ${user.full_name}`,
      type: 'diagnostic',
      urgency: Urgency.NORMAL,
      actor: user.full_name,
      report_url: test.report_url,
    });
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
          <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Clinical Diagnostic Report</h2>
              <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mt-1">Order Ref: {viewingReport.id}</p>
            </div>
            <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Details</p>
                  <p className="font-bold text-slate-800 text-lg">{patient?.patient_name || 'N/A'}</p>
                  <p className="text-xs text-slate-500">ID: #{patient?.patient_id} • {patient?.age} Yrs • {patient?.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investigation Details</p>
                  <p className="font-bold text-teal-700">{viewingReport.test_name}</p>
                  <p className="text-xs text-slate-500">Priority: {viewingReport.priority} • Date: {new Date(viewingReport.scheduled_datetime).toLocaleDateString()}</p>
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
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" /></svg>
                Digital Report Document
              </h3>
              <div className="aspect-[4/3] w-full bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" /></svg>
                </div>
                <h4 className="font-black text-slate-700 uppercase tracking-tight">Report File: {viewingReport.test_name.replace(/\s/g, '_')}_Result.pdf</h4>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">This is a simulated secure PDF preview. In a production environment, this would render a verified medical document.</p>
                <div className="mt-8 flex space-x-3">
                  <a href={viewingReport.report_url} target="_blank" rel="noreferrer" className="bg-teal-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100">Open in Full View</a>
                  <button className="bg-slate-800 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Print Record</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 border-t flex justify-end">
            <button onClick={() => setViewingReport(null)} className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Close Report Viewer</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase">
          <tr>
            <th className="px-6 py-4">Test Order</th>
            <th className="px-6 py-4">Patient</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">{activeTab === 'Completed' ? 'Completed At' : 'Requested'}</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {displayTests.length > 0 ? displayTests.map(test => {
            const patient = patients.find(p => p.patient_id === test.patient_id);
            const canComplete = !!test.report_url;

            return (
              <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{test.test_name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">ORDER_{test.id}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold">{patient?.patient_name || 'Unknown'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">PID: #{patient?.patient_id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    test.priority === Urgency.CRITICAL ? 'bg-red-500 text-white shadow-sm shadow-red-100' : 
                    test.priority === Urgency.HIGH ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>{test.priority}</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                  {new Date(test.scheduled_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center text-xs font-black uppercase tracking-widest ${
                    test.status === 'Completed' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      test.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                    }`}></span>
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    {activeTab !== 'Completed' ? (
                      <>
                        {!test.report_url ? (
                          <label className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center cursor-pointer shadow-sm">
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadReport(test.id, file.name);
                              }} 
                            />
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2.5" /></svg>
                            Upload File
                          </label>
                        ) : (
                          <div className="flex items-center text-green-600 text-[10px] font-black uppercase mr-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>
                            File OK
                          </div>
                        )}
                        <button 
                          disabled={!canComplete}
                          onClick={() => handleComplete(test.id)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                            canComplete ? 'bg-teal-600 text-white shadow-lg shadow-teal-100 hover:bg-teal-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          Mark Done
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setViewingReport(test)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" /></svg>
                        View Report
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" /></svg>
                {activeTab === 'Completed' ? 'No completed investigations found.' : 'All clear. Investigation queue is empty.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">DIAGNOSTIC WORKFLOW</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{activeTab} List</p>
              </div>
              <div className="flex bg-white rounded-xl shadow-sm border p-1 space-x-1">
                <button onClick={() => setActiveTab('Assigned Tests')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Assigned Tests' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Pending</button>
                <button onClick={() => setActiveTab('Completed')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Completed' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Completed</button>
              </div>
            </div>
            {renderTable()}
            {activeTab === 'Assigned Tests' && displayTests.some(t => t.priority === Urgency.CRITICAL) && (
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center text-red-700 animate-pulse">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" /></svg>
                <span className="font-black uppercase tracking-widest text-xs">Priority Alert: Critical investigations pending in your queue!</span>
              </div>
            )}
          </div>
        </main>
      </div>
      {renderReportModal()}
    </div>
  );
};

export default DiagnosticDashboard;
