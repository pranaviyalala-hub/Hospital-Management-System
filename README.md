# Team Name: Overclocked Minds
## Project Title: Hospital Management System

### Description:This is a high-fidelity Clinical ERP (Enterprise Resource Planning) and Workflow Management System. Unlike traditional hospital systems that are siloed by department, this application uses a Patient-Centric Model. Upon registration, the system automatically assembles a multi-disciplinary care team (Doctor, Nurse, Diagnostic Technician, and Pharmacist) to manage the patient’s journey.
### The application features five distinct, role-based dashboards:
#### Admin: Handles registrations, ER admissions, and high-level hospital oversight.
#### Doctor: Manages clinical orders (Prescriptions, Labs, Nursing, Surgery Requests) and patient discharge.
#### Nurse: Executes care instructions, logs vitals, and manages medication administration rounds.
#### Diagnostic: Processes lab/imaging requests, uploads digital reports, and verifies results.
#### Pharmacy: Manages medication dispensing, identifies drug-allergy conflicts, and tracks inventory levels.

### Tech Stack used:
#### Core Library: React 19 (Functional components, Hooks, and specialized state management).
#### Language: TypeScript (Strongly typed interfaces for clinical data structures).
#### Styling: Tailwind CSS (Utility-first framework for a clean, modern "Clinical UI" aesthetic).
#### Persistence Layer: LocalStorage-backed Simulation Engine (Simulates a dynamic cloud database with zero-loss persistence across refreshes).
#### Module System: Native Browser ES Modules via Import Maps (No build-step required for execution).
#### Typography: Google Fonts (Inter) for maximum readability in high-pressure clinical environments.

### How to run the project:
#### Environment: Place all project files in a flat directory (project root).
#### Web Server: Serve the directory using a simple local web server:
#### VS Code: Use the "Live Server" extension.
#### Python: Run python -m http.server 8000.
#### Node.js: Run npx serve ..
#### Access: Open your browser to http://localhost:[port].
#### Login: Use the credentials provided in the system seed (e.g., doctor1@hospital.local / Doc@123). Ensure you select the correct Access Gateway (Role) on the login screen

### Dependencies:
#### All dependencies are loaded via ESM (ES Modules) or CDN to ensure the app is lightweight and highly portable:
#### react: ^19.2.4 (via esm.sh)
#### react-dom: ^19.2.4 (via esm.sh)
#### tailwindcss: (via Play CDN)
#### Google Fonts: Inter (300-900 weights)

### Any important instructions:
#### Data Persistence: The "database" is entirely client-side. All patient admissions, vitals, and clinical events are stored in your browser's localStorage. Do not clear site data if you wish to maintain your current hospital state.
#### Team Logic: The system uses a randomized assignment engine. When an Admin admits a patient, a full care team is pulled from the active employee pool. To see the full workflow, you must log in as different staff members assigned to that specific patient.
#### Safety Alerts: The system includes a "Clinical Rule Engine." For example, if a Doctor prescribes a medicine that matches a patient's recorded allergy, both the Doctor and the Pharmacist will receive a high-visibility red conflict alert.
#### OR Management: Surgery scheduling and Operating Room (OR) management are now clinical functions. Only Doctors have access to the "OR Control Center" to manage unit availability and procedure status.

### Demo videos:

### Demo images:
