
import React, { useState } from 'react';
import { Patient, Urgency, PatientStatus, Employee, UserRole } from '../../types';

interface FormProps {
  onSubmit: (data: any) => void;
  employees: Employee[];
}

const PatientRegistrationForm: React.FC<FormProps> = ({ onSubmit, employees }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    height_cm: '',
    weight_kg: '',
    temperature_c: '36.6',
    blood_group: 'A+',
    bp: '120/80',
    allergies: '',
    priority: Urgency.NORMAL,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Random Assignment Logic
    const doctors = employees.filter(e => e.role === UserRole.DOCTOR);
    const nurses = employees.filter(e => e.role === UserRole.NURSE);
    const diagStaff = employees.filter(e => e.role === UserRole.DIAGNOSTIC);
    const pharmStaff = employees.filter(e => e.role === UserRole.PHARMACY);

    const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    const assignments = {
      assigned_doctor_id: random(doctors).employee_id,
      assigned_nurse_id: random(nurses).employee_id,
      assigned_diag_id: random(diagStaff).employee_id,
      assigned_pharm_id: random(pharmStaff).employee_id,
    };

    onSubmit({
      ...formData,
      ...assignments,
      age: parseInt(formData.age),
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      temperature_c: parseFloat(formData.temperature_c),
      status: PatientStatus.ADMITTED,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input name="patient_name" required onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input name="age" type="number" required onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select name="gender" onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select name="priority" onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-slate-50">
            <option value={Urgency.NORMAL}>Normal</option>
            <option value={Urgency.HIGH}>High</option>
            <option value={Urgency.CRITICAL}>Critical / Emergency</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 border-b pb-2">Vitals & Clinical</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Height (cm)</label>
            <input name="height_cm" type="number" step="0.1" required onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Weight (kg)</label>
            <input name="weight_kg" type="number" step="0.1" required onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Temp (°C)</label>
            <input name="temperature_c" step="0.1" required onChange={handleChange} value={formData.temperature_c} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Blood Group</label>
            <select name="blood_group" onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg}>{bg}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Blood Pressure (BP)</label>
          <input name="bp" placeholder="e.g. 120/80" required onChange={handleChange} value={formData.bp} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 border-b pb-2">Additional Details</h3>
        <div>
          <label className="block text-sm mb-1">Known Allergies</label>
          <textarea name="allergies" rows={4} onChange={handleChange} placeholder="List allergies or write 'None'" className="w-full border rounded-lg px-3 py-2"></textarea>
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Confirm Admission & Assign Team
          </button>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Randomly assigns Doctor, Nurse, Lab, and Pharmacy staff from on-duty pool.</p>
        </div>
      </div>
    </form>
  );
};

export default PatientRegistrationForm;
