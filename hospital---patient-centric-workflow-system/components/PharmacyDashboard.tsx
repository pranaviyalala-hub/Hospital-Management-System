
import React from 'react';
import { UserRole, Patient, Employee, TimelineEvent, Prescription, Urgency } from '../types';
import { MOCK_INVENTORY } from '../constants';
import Sidebar from './shared/Sidebar';
import Header from './shared/Header';

interface PharmacyDashboardProps {
  user: Employee;
  patients: Patient[];
  prescriptions: Prescription[];
  setPrescriptions: any;
  addEvent: any;
  onLogout: () => void;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ user, patients, prescriptions, setPrescriptions, addEvent, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState('Pending Orders');

  const pending = prescriptions.filter(p => p.status === 'Pending');
  const dispensed = prescriptions.filter(p => p.status === 'Dispensed');

  const handleDispense = (pId: string) => {
    const prescription = prescriptions.find(p => p.id === pId);
    if (!prescription) return;

    setPrescriptions((prev: Prescription[]) => prev.map(p => p.id === pId ? { ...p, status: 'Dispensed' } : p));
    
    addEvent({
      patient_id: prescription.patient_id,
      title: 'Medication Dispensed',
      description: `Pharmacist ${user.full_name} dispensed ${prescription.medicine_name}`,
      type: 'prescription',
      urgency: Urgency.NORMAL,
      actor: user.full_name,
    });
  };

  const renderInventory = () => (
    <div className="bg-white rounded-2xl shadow-sm border animate-in fade-in duration-300 flex flex-col max-h-[70vh]">
      <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-2xl z-20">
        <div>
          <h3 className="text-lg font-black text-slate-800">Pharmacy & Store Inventory</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time stock levels and reorder alerts</p>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-4 bg-slate-50">Item ID</th>
              <th className="px-6 py-4 bg-slate-50">Name / Category</th>
              <th className="px-6 py-4 bg-slate-50">Form / Spec</th>
              <th className="px-6 py-4 bg-slate-50">Current Stock</th>
              <th className="px-6 py-4 bg-slate-50">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm bg-white">
            {MOCK_INVENTORY.map(item => {
              const stockPercent = (item.stock / item.max_stock) * 100;
              const isLow = item.stock <= item.min_stock;
              
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">#{item.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.category} • {item.subcategory}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{item.form}</p>
                    <p className="text-[10px] text-slate-500">{item.spec}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-700">{item.stock} {item.uom}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-black uppercase ${isLow ? 'text-red-500' : 'text-slate-400'}`}>
                          {isLow ? 'REORDER' : 'STABLE'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{Math.round(stockPercent)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min(100, stockPercent)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDispensedList = () => (
    <div className="bg-white rounded-2xl shadow-sm border animate-in fade-in duration-300 flex flex-col max-h-[70vh]">
      <div className="p-6 border-b bg-white rounded-t-2xl z-20">
        <h3 className="text-lg font-black text-slate-800">Dispensing History</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Verified and completed medication releases</p>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left relative">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-4 bg-slate-50">Prescription Ref</th>
              <th className="px-6 py-4 bg-slate-50">Patient Name</th>
              <th className="px-6 py-4 bg-slate-50">Medicine & Dosage</th>
              <th className="px-6 py-4 bg-slate-50">Status</th>
              <th className="px-6 py-4 bg-slate-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm bg-white">
            {dispensed.length > 0 ? dispensed.map(p => {
               const patient = patients.find(pat => pat.patient_id === p.patient_id);
               return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">#{p.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{patient?.patient_name || 'N/A'}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">PID: #{patient?.patient_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-700">{p.medicine_name}</p>
                    <p className="text-xs text-blue-600 font-bold">{p.dosage} • {p.frequency}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                      Dispensed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest">Print Label</button>
                  </td>
                </tr>
               );
            }) : (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 italic">No dispensed medications in the recent history.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPendingOrders = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {pending.length > 0 ? pending.map(p => {
        const patient = patients.find(pat => pat.patient_id === p.patient_id);
        const hasAllergyConflict = patient?.allergies.toLowerCase().includes(p.medicine_name.toLowerCase());

        return (
          <div key={p.id} className={`bg-white rounded-3xl shadow-sm border-2 p-6 hover:shadow-xl transition-all ${
            hasAllergyConflict ? 'border-red-500 bg-red-50/10' : 'border-transparent'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                p.urgency === Urgency.CRITICAL ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
              }`}>{p.urgency} Order</span>
              <span className="text-slate-300 text-[10px] font-mono font-bold">TXN_{p.id}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-800 leading-tight">{p.medicine_name}</h3>
            <p className="text-blue-600 font-black text-sm mb-6 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
              {p.dosage} • {p.frequency}
            </p>
            
            <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-3 border border-slate-100">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-black uppercase">Patient Name</span>
                <span className="text-xs font-black text-slate-700">{patient?.patient_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase mb-1 block">Clinical Alerts</span>
                {hasAllergyConflict ? (
                  <div className="bg-red-500 text-white p-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center shadow-lg shadow-red-100">
                    <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" /></svg>
                    CRITICAL: Drug-Allergy Conflict Detected
                  </div>
                ) : (
                  <div className="text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>
                    Safety Check Passed
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => handleDispense(p.id)}
              className="w-full bg-slate-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-slate-900 transition-all active:scale-95"
            >
              Confirm & Dispense
            </button>
          </div>
        );
      }) : (
        <div className="col-span-full py-24 bg-white rounded-3xl border-dashed border-2 flex flex-col items-center justify-center text-slate-400 border-slate-200">
          <svg className="w-16 h-16 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" /></svg>
          <p className="font-black uppercase tracking-widest text-sm">Pharmacy queue empty</p>
          <p className="text-xs font-medium mt-1">Standby for incoming clinical orders</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-tighter">Pharmacy Management</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Central Clinical Dispensary</p>
              </div>
              <div className="bg-white border rounded-xl p-1 shadow-sm flex space-x-1 sticky top-0 z-30">
                {['Pending Orders', 'Dispensed List', 'Inventory'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'Pending Orders' && renderPendingOrders()}
            {activeTab === 'Dispensed List' && renderDispensedList()}
            {activeTab === 'Inventory' && renderInventory()}

            {activeTab === 'Inventory' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total SKUs</p>
                  <p className="text-2xl font-black">{MOCK_INVENTORY.length}</p>
                </div>
                <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-100">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Stock Alerts</p>
                  <p className="text-2xl font-black">{MOCK_INVENTORY.filter(i => i.stock <= i.min_stock).length} Items</p>
                </div>
                <div className="bg-teal-500 p-4 rounded-2xl text-white shadow-lg shadow-teal-100">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Categories</p>
                  <p className="text-2xl font-black">{new Set(MOCK_INVENTORY.map(i => i.category)).size}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl text-white shadow-lg shadow-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Suppliers</p>
                  <p className="text-2xl font-black">18 Active</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
