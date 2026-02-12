
import React from 'react';
import { UserRole, Urgency, PatientStatus, InventoryItem, Patient, Employee } from './types';

export const COLORS = {
  primary: '#2563eb', // Blue 600
  secondary: '#14b8a6', // Teal 500
  normal: '#22c55e', // Green 500
  high: '#f59e0b', // Amber 500
  critical: '#ef4444', // Red 500
  bg: '#f8fafc',
};

export const MOCK_EMPLOYEES: Employee[] = [
  // Doctors
  { employee_id: 'EMPD001', full_name: 'Danielle Johnson', email: 'doctor1@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'General Medicine', designation: 'MBBS, MD', phone: '3321819600', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD002', full_name: 'William Johnson', email: 'doctor2@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Neurology', designation: 'MBBS, DNB', phone: '8637940265', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD003', full_name: 'Susan Rogers', email: 'doctor3@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Orthopedics', designation: 'MBBS, MS', phone: '6155940781', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD004', full_name: 'Kelly Fuller', email: 'doctor4@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS, MD', phone: '9310341316', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD005', full_name: 'Francisco Kelly', email: 'doctor5@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'General Medicine', designation: 'MBBS', phone: '1928327648', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD006', full_name: 'Jeremy Johnson', email: 'doctor6@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS, MD', phone: '6413953767', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD007', full_name: 'John Hoffman', email: 'doctor7@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Neurology', designation: 'MBBS, MS', phone: '9696532871', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD008', full_name: 'Courtney Conner', email: 'doctor8@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Neurology', designation: 'MBBS, MD', phone: '9166978480', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD009', full_name: 'Kayla Peterson', email: 'doctor9@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Neurology', designation: 'MBBS', phone: '6270482814', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD010', full_name: 'Eric Farmer', email: 'doctor10@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Pediatrics', designation: 'MBBS', phone: '9570154303', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD011', full_name: 'Jessica Cabrera', email: 'doctor11@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Orthopedics', designation: 'MBBS, MD', phone: '2782489638', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD012', full_name: 'Wanda Santos', email: 'doctor12@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'ENT', designation: 'MBBS', phone: '8713315098', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD013', full_name: 'Adrian Zimmerman', email: 'doctor13@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Orthopedics', designation: 'MBBS, DNB', phone: '3105183473', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD014', full_name: 'Barbara Sanchez', email: 'doctor14@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'ENT', designation: 'MBBS, MS', phone: '6311656670', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD015', full_name: 'Jessica Mcbride', email: 'doctor15@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS, MD', phone: '3338726247', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD016', full_name: 'Lindsey Chase', email: 'doctor16@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS', phone: '0801326773', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD017', full_name: 'Nicholas Galloway', email: 'doctor17@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'ENT', designation: 'MBBS, DNB', phone: '7468723430', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD018', full_name: 'Julie Brown', email: 'doctor18@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'General Medicine', designation: 'MBBS, DNB', phone: '8820812191', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD019', full_name: 'Shelly Hudson', email: 'doctor19@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS', phone: '9169985435', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPD020', full_name: 'David Brewer', email: 'doctor20@hospital.local', password: 'Doc@123', role: UserRole.DOCTOR, department: 'Cardiology', designation: 'MBBS', phone: '5107991183', is_active: true, created_at: '2026-02-01T10:00:00' },

  // Nurses
  { employee_id: 'EMPN001', full_name: 'Taylor Ibarra', email: 'nurse1@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'OT', designation: 'ICU Nurse', phone: '5427849808', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN002', full_name: 'Deborah Preston', email: 'nurse2@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward A', designation: 'Staff Nurse', phone: '4493534874', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN003', full_name: 'Sandra Williams', email: 'nurse3@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward A', designation: 'ICU Nurse', phone: '2427868011', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN004', full_name: 'Mary Aguilar', email: 'nurse4@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Emergency', designation: 'Staff Nurse', phone: '6204505331', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN005', full_name: 'Valerie Brady', email: 'nurse5@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward B', designation: 'ICU Nurse', phone: '2260256342', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN006', full_name: 'Shannon Walker', email: 'nurse6@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'Senior Nurse', phone: '5433036541', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN007', full_name: 'Jennifer Zavala', email: 'nurse7@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'OT', designation: 'Staff Nurse', phone: '0142940196', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN008', full_name: 'Lisa Dixon', email: 'nurse8@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward B', designation: 'Senior Nurse', phone: '9340608835', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN009', full_name: 'Lisa Alvarado', email: 'nurse9@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'ICU Nurse', phone: '4846564823', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN010', full_name: 'Lisa Turner', email: 'nurse10@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'Senior Nurse', phone: '4436995777', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN011', full_name: 'Rebecca Moyer', email: 'nurse11@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward B', designation: 'Staff Nurse', phone: '1489513433', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN012', full_name: 'John Alvarez', email: 'nurse12@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Emergency', designation: 'ICU Nurse', phone: '7693676320', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN013', full_name: 'Casey Rubio', email: 'nurse13@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'OT', designation: 'Senior Nurse', phone: '0831727889', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN014', full_name: 'Lisa Mcclain', email: 'nurse14@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward B', designation: 'ICU Nurse', phone: '8727743487', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN015', full_name: 'Angela Mitchell', email: 'nurse15@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'OT Nurse', phone: '5581223623', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN016', full_name: 'Erin Owens', email: 'nurse16@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward B', designation: 'ICU Nurse', phone: '3669096705', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN017', full_name: 'Kimberly Navarro', email: 'nurse17@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'ICU Nurse', phone: '7346706562', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN018', full_name: 'Kimberly Meadows', email: 'nurse18@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'ICU', designation: 'OT Nurse', phone: '1627204653', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN019', full_name: 'Paige Gray', email: 'nurse19@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'OT', designation: 'Senior Nurse', phone: '4170805310', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN020', full_name: 'Sara Howell', email: 'nurse20@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Ward A', designation: 'Staff Nurse', phone: '2719374529', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN021', full_name: 'Traci Rodriguez', email: 'nurse21@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'Senior Nurse', phone: '4966319314', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN022', full_name: 'Rachel Reed', email: 'nurse22@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Emergency', designation: 'Staff Nurse', phone: '5185067165', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN023', full_name: 'Casey Boyd', email: 'nurse23@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'OT', designation: 'OT Nurse', phone: '9877694531', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN024', full_name: 'Nicole Hudson', email: 'nurse24@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'Staff Nurse', phone: '5075273545', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPN025', full_name: 'Angela Black', email: 'nurse25@hospital.local', password: 'Nurse@123', role: UserRole.NURSE, department: 'Pediatrics', designation: 'ICU Nurse', phone: '1367837770', is_active: true, created_at: '2026-02-01T10:00:00' },

  // Admin
  { employee_id: 'EMPA001', full_name: 'Richard Sanchez', email: 'admin1@hospital.local', password: 'Admin@123', role: UserRole.ADMIN, department: 'Administration', designation: 'Operations Admin', phone: '7885685574', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPA002', full_name: 'David Lee', email: 'admin2@hospital.local', password: 'Admin@123', role: UserRole.ADMIN, department: 'Administration', designation: 'Front Desk Admin', phone: '8233749894', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPA003', full_name: 'Jeremy White', email: 'admin3@hospital.local', password: 'Admin@123', role: UserRole.ADMIN, department: 'Administration', designation: 'Operations Admin', phone: '8240084271', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPA004', full_name: 'Taylor Alexander', email: 'admin4@hospital.local', password: 'Admin@123', role: UserRole.ADMIN, department: 'Administration', designation: 'Operations Admin', phone: '0471167190', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPA005', full_name: 'Stacy Miller', email: 'admin5@hospital.local', password: 'Admin@123', role: UserRole.ADMIN, department: 'Administration', designation: 'Front Desk Admin', phone: '1869993867', is_active: true, created_at: '2026-02-01T10:00:00' },

  // Pharmacy
  { employee_id: 'EMPP001', full_name: 'Veronica Torres', email: 'pharmacy1@hospital.local', password: 'Pharm@123', role: UserRole.PHARMACY, department: 'Pharmacy', designation: 'Senior Pharmacist', phone: '9133412328', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPP002', full_name: 'Ricky Norris', email: 'pharmacy2@hospital.local', password: 'Pharm@123', role: UserRole.PHARMACY, department: 'Pharmacy', designation: 'Pharmacist', phone: '4034471349', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPP003', full_name: 'Amy Holland', email: 'pharmacy3@hospital.local', password: 'Pharm@123', role: UserRole.PHARMACY, department: 'Pharmacy', designation: 'Senior Pharmacist', phone: '2102499471', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPP004', full_name: 'Sherri Mason', email: 'pharmacy4@hospital.local', password: 'Pharm@123', role: UserRole.PHARMACY, department: 'Pharmacy', designation: 'Pharmacist', phone: '7190659401', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPP005', full_name: 'Stephanie Key', email: 'pharmacy5@hospital.local', password: 'Pharm@123', role: UserRole.PHARMACY, department: 'Pharmacy', designation: 'Pharmacist', phone: '9027874296', is_active: true, created_at: '2026-02-01T10:00:00' },

  // Diagnostic
  { employee_id: 'EMPDG001', full_name: 'Michael Cook', email: 'diagnostic1@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Radiology', designation: 'Senior Lab Technician', phone: '2567468071', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG002', full_name: 'Darrell Barton', email: 'diagnostic2@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Diagnostics', designation: 'Senior Lab Technician', phone: '8760385977', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG003', full_name: 'Andrea Pennington', email: 'diagnostic3@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Laboratory', designation: 'Senior Lab Technician', phone: '7109324808', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG004', full_name: 'Victoria Durham', email: 'diagnostic4@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Radiology', designation: 'Lab Technician', phone: '1274846773', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG005', full_name: 'Patrick Weeks', email: 'diagnostic5@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Diagnostics', designation: 'Lab Technician', phone: '1465840449', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG006', full_name: 'Sean Washington', email: 'diagnostic6@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Laboratory', designation: 'Senior Lab Technician', phone: '8867533963', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG007', full_name: 'Julie Thornton', email: 'diagnostic7@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Radiology', designation: 'Senior Lab Technician', phone: '6270289517', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG008', full_name: 'Alexis Thomas', email: 'diagnostic8@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Laboratory', designation: 'Radiology Technician', phone: '1745961586', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG009', full_name: 'Barry Jones', email: 'diagnostic9@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Radiology', designation: 'Lab Technician', phone: '3161172400', is_active: true, created_at: '2026-02-01T10:00:00' },
  { employee_id: 'EMPDG010', full_name: 'Michael Jordan', email: 'diagnostic10@hospital.local', password: 'Diag@123', role: UserRole.DIAGNOSTIC, department: 'Laboratory', designation: 'Radiology Technician', phone: '8692221969', is_active: true, created_at: '2026-02-01T10:00:00' },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    patient_id: 1,
    patient_name: 'Curtis White',
    age: 52,
    gender: 'Male',
    height_cm: 142,
    weight_kg: 59,
    temperature_c: 36.9,
    blood_group: 'O+',
    bp: '101/76',
    allergies: 'Seafood, Penicillin',
    priority: Urgency.NORMAL,
    status: PatientStatus.ADMITTED,
    registration_datetime: '2026-02-06T21:36:00',
    assigned_doctor_id: 'EMPD001',
    assigned_nurse_id: 'EMPN001',
    assigned_diag_id: 'EMPDG001',
    assigned_pharm_id: 'EMPP001'
  },
  {
    patient_id: 2,
    patient_name: 'Peter King',
    age: 26,
    gender: 'Male',
    height_cm: 195,
    weight_kg: 57,
    temperature_c: 38.8,
    blood_group: 'B-',
    bp: '137/84',
    allergies: 'None',
    priority: Urgency.HIGH,
    status: PatientStatus.SURGERY_SCHEDULED,
    registration_datetime: '2026-02-07T18:48:00',
    assigned_doctor_id: 'EMPD002',
    assigned_nurse_id: 'EMPN002',
    assigned_diag_id: 'EMPDG001',
    assigned_pharm_id: 'EMPP001'
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'ITM1001', category: 'Blood Bank', subcategory: 'Blood Product', name: 'Whole Blood', form: 'Unit', spec: '350 mL', pack: '1', uom: 'Bag', stock: 15, min_stock: 10, max_stock: 30, unit_cost: 1500.0 },
  { id: 'ITM1011', category: 'Pharmacy', subcategory: 'IV Fluid', name: 'Normal Saline', form: 'IV Fluid', spec: '0.9% 500 mL', pack: '1', uom: 'Bag', stock: 450, min_stock: 200, max_stock: 1200, unit_cost: 35.0 },
  { id: 'ITM1031', category: 'Pharmacy', subcategory: 'Emergency', name: 'Adrenaline (Epinephrine)', form: 'Injection', spec: '1 mg/mL', pack: '1', uom: 'Ampoule', stock: 85, min_stock: 30, max_stock: 200, unit_cost: 12.0 },
  { id: 'ITM1059', category: 'Pharmacy', subcategory: 'Antibiotic', name: 'Amoxicillin', form: 'Capsule', spec: '500 mg', pack: '10', uom: 'Strip', stock: 600, min_stock: 200, max_stock: 1200, unit_cost: 3.0 },
  { id: 'ITM1107', category: 'Pharmacy', subcategory: 'Analgesic', name: 'Paracetamol', form: 'Tablet', spec: '500 mg', pack: '10', uom: 'Strip', stock: 1200, min_stock: 400, max_stock: 3000, unit_cost: 1.0 },
  { id: 'ITM1116', category: 'Pharmacy', subcategory: 'GI', name: 'Pantoprazole', form: 'Tablet', spec: '40 mg', pack: '10', uom: 'Strip', stock: 400, min_stock: 150, max_stock: 900, unit_cost: 4.0 },
  { id: 'ITM1153', category: 'Pharmacy', subcategory: 'Diabetes', name: 'Metformin', form: 'Tablet', spec: '500 mg', pack: '10', uom: 'Strip', stock: 500, min_stock: 150, max_stock: 900, unit_cost: 1.5 },
  { id: 'ITM1157', category: 'Pharmacy', subcategory: 'Diabetes', name: 'Insulin Regular', form: 'Injection', spec: '100 IU/mL', pack: '1', uom: 'Vial', stock: 45, min_stock: 20, max_stock: 120, unit_cost: 160.0 },
  { id: 'ITM1203', category: 'Stores', subcategory: 'Consumable', name: 'Syringe 2mL', form: 'Consumable', spec: 'Luer Lock', pack: '100', uom: 'Piece', stock: 800, min_stock: 200, max_stock: 2000, unit_cost: 3.0 },
  { id: 'ITM1209', category: 'Stores', subcategory: 'Consumable', name: 'IV Cannula 18G', form: 'Consumable', spec: 'Standard', pack: '1', uom: 'Piece', stock: 220, min_stock: 100, max_stock: 800, unit_cost: 22.0 },
  { id: 'ITM1223', category: 'Stores', subcategory: 'Consumable', name: 'Surgical Gloves', form: 'Consumable', spec: 'Sterile size 7', pack: '50', uom: 'Pair', stock: 180, min_stock: 50, max_stock: 400, unit_cost: 18.0 },
  { id: 'ITM1225', category: 'Stores', subcategory: 'Consumable', name: 'Face Mask 3-ply', form: 'Consumable', spec: 'Standard', pack: '100', uom: 'Box', stock: 120, min_stock: 30, max_stock: 250, unit_cost: 180.0 },
];

export const ICONS = {
  Doctor: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Nurse: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 13.13a2.44 2.44 0 0 1 1.66-2.36l1.34-.44V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5.33l1.34.44A2.44 2.44 0 0 1 21 13.13V22H3v-8.87z" />
      <path d="M8 8h8M12 4v8" />
    </svg>
  ),
  Pharmacy: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  Diagnostic: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  ),
  Admin: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};
