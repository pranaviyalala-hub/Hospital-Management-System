
export enum UserRole {
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  DIAGNOSTIC = 'Diagnostic',
  PHARMACY = 'Pharmacy'
}

export enum Urgency {
  NORMAL = 'Normal',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum PatientStatus {
  ADMITTED = 'Admitted',
  SURGERY_SCHEDULED = 'Surgery Scheduled',
  IN_SURGERY = 'In Surgery',
  DISCHARGED = 'Discharged'
}

export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  password: string; // New field for credential validation
  role: UserRole;
  department: string;
  designation: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height_cm: number;
  weight_kg: number;
  temperature_c: number;
  blood_group: string;
  bp: string;
  allergies: string;
  priority: Urgency;
  status: PatientStatus;
  registration_datetime: string;
  assigned_doctor_id?: string;
  assigned_nurse_id?: string;
  assigned_diag_id?: string;
  assigned_pharm_id?: string;
  assigned_admin_id?: string;
}

export interface TimelineEvent {
  id: string;
  patient_id: number;
  timestamp: string;
  title: string;
  description: string;
  type: 'prescription' | 'diagnostic' | 'nursing' | 'surgery' | 'status' | 'registration' | 'vitals';
  urgency: Urgency;
  actor: string;
  report_url?: string;
}

export interface Prescription {
  id: string;
  patient_id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  times: string[];
  duration: number;
  urgency: Urgency;
  instructions: string;
  status: 'Pending' | 'In Progress' | 'Dispensed';
  adherence: { [key: string]: 'administered' | 'missed' | 'pending' };
}

export interface DiagnosticTest {
  id: string;
  patient_id: number;
  test_name: string;
  body_area?: string;
  priority: Urgency;
  scheduled_datetime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  technician?: string;
  report_url?: string;
  notes?: string;
}

export interface NursingInstruction {
  id: string;
  patient_id: number;
  care_instruction: string;
  urgency: Urgency;
  status: 'Pending' | 'Completed';
  timestamp: string;
  doctor_name: string;
}

export interface ORRequest {
  id: string;
  patient_id: number;
  doctor_id: string;
  doctor_name: string;
  surgery_name: string;
  date: string;
  time: string;
  duration: number;
  urgency: Urgency;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  timestamp: string;
}

export interface ORRoom {
  id: string;
  name: string;
  status: 'Available' | 'Booked' | 'In Surgery' | 'Cleaning';
  current_patient_id?: number;
}

export interface InventoryItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  form: string;
  spec: string;
  pack: string;
  uom: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  unit_cost: number;
}
