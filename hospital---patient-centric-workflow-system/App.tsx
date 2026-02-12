
import React, { useState, useEffect } from 'react';
import { UserRole, Patient, Employee, TimelineEvent, Prescription, DiagnosticTest, NursingInstruction, ORRequest, PatientStatus, ORRoom } from './types';
import { MOCK_EMPLOYEES, MOCK_PATIENTS } from './constants';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import NurseDashboard from './components/NurseDashboard';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';

// Database Keys
const DB_KEYS = {
  PATIENTS: 'hosp_db_patients',
  EMPLOYEES: 'hosp_db_employees',
  TIMELINE: 'hosp_db_timeline',
  PRESCRIPTIONS: 'hosp_db_prescriptions',
  TESTS: 'hosp_db_tests',
  NURSING: 'hosp_db_nursing',
  OR_REQUESTS: 'hosp_db_or_requests',
  ORS: 'hosp_db_ors'
};

const App: React.FC = () => {
  // Database Initializers
  const loadData = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  
  // Dynamic "Database" State
  const [employees, setEmployees] = useState<Employee[]>(() => loadData(DB_KEYS.EMPLOYEES, MOCK_EMPLOYEES));
  const [patients, setPatients] = useState<Patient[]>(() => loadData(DB_KEYS.PATIENTS, MOCK_PATIENTS));
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => loadData(DB_KEYS.TIMELINE, []));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => loadData(DB_KEYS.PRESCRIPTIONS, []));
  const [tests, setTests] = useState<DiagnosticTest[]>(() => loadData(DB_KEYS.TESTS, []));
  const [nursingInstructions, setNursingInstructions] = useState<NursingInstruction[]>(() => loadData(DB_KEYS.NURSING, []));
  const [orRequests, setOrRequests] = useState<ORRequest[]>(() => loadData(DB_KEYS.OR_REQUESTS, []));
  const [ors, setOrs] = useState<ORRoom[]>(() => loadData(DB_KEYS.ORS, [
    { id: 'A', name: 'OR-A', status: 'Available' },
    { id: 'B', name: 'OR-B', status: 'Available' },
    { id: 'C', name: 'OR-C', status: 'Booked', current_patient_id: 1 },
    { id: 'D', name: 'OR-D', status: 'Available' },
    { id: 'E', name: 'OR-E', status: 'Available' },
  ]));

  // Auto-Sync Persistence Hook
  useEffect(() => {
    localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(employees));
    localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(patients));
    localStorage.setItem(DB_KEYS.TIMELINE, JSON.stringify(timeline));
    localStorage.setItem(DB_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
    localStorage.setItem(DB_KEYS.TESTS, JSON.stringify(tests));
    localStorage.setItem(DB_KEYS.NURSING, JSON.stringify(nursingInstructions));
    localStorage.setItem(DB_KEYS.OR_REQUESTS, JSON.stringify(orRequests));
    localStorage.setItem(DB_KEYS.ORS, JSON.stringify(ors));
  }, [employees, patients, timeline, prescriptions, tests, nursingInstructions, orRequests, ors]);

  const addEvent = (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  const handleLogout = () => setCurrentUser(null);

  const renderDashboard = () => {
    if (!currentUser) return <LoginPage onLogin={setCurrentUser} employees={employees} />;

    const commonProps = {
      user: currentUser,
      patients,
      setPatients,
      timeline,
      addEvent,
      onLogout: handleLogout,
      prescriptions,
      setPrescriptions,
      tests,
      setTests,
      nursingInstructions,
      setNursingInstructions,
      orRequests,
      setOrRequests,
      employees,
    };

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return <AdminDashboard {...commonProps} ors={ors} setOrs={setOrs} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard {...commonProps} ors={ors} setOrs={setOrs} />;
      case UserRole.NURSE:
        return <NurseDashboard {...commonProps} />;
      case UserRole.DIAGNOSTIC:
        return <DiagnosticDashboard {...commonProps} />;
      case UserRole.PHARMACY:
        return <PharmacyDashboard {...commonProps} />;
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {renderDashboard()}
    </div>
  );
};

export default App;
