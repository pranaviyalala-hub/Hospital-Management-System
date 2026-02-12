
# Hospital – Patient-Centric Clinical Workflow System

A high-performance Hospital ERP designed for modern clinical teams. This system replaces traditional doctor-centric models with a **Patient-Centric Random Care Team Model**, ensuring every patient has a dedicated, multi-disciplinary team assigned at admission.

## 🚀 Key Features
- **ERP Operations**: Full admin dashboard for registration, OR booking, and discharge.
- **Role-Based Access**: Specialized interfaces for Doctors, Nurses, Diagnostic Technicians, and Pharmacists.
- **Workflow Engine**: Integrated Camunda 8 BPMN logic for tracking orders.
- **Real-Time Timeline**: Unified event feed showing every clinical action from registration to discharge.
- **AI Rule Engine**: Automated drug-allergy conflict detection, medication adherence scoring, and department bottleneck alerts.

## 🛠 Tech Stack
- **Frontend**: React 18, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, Socket.IO (Real-time)
- **Database**: PostgreSQL with Prisma ORM
- **Workflow**: Camunda 8 (Zeebe)
- **Deployment**: Docker Compose

## 🏃 Local Setup
1. **Clone & Install**: `npm install`
2. **Environment**: Rename `.env.example` to `.env` and configure Postgres.
3. **Database**: `npx prisma migrate dev && npx prisma db seed`
4. **Docker**: `docker-compose up -d`
5. **Start**: `npm run dev`

## 💡 Hackathon Demo Scenario
1. **Login as Admin**: Register a patient "John Doe" with an allergy to "Penicillin".
2. **Auto-Assignment**: Observe that a Doctor, Nurse, Lab Tech, and Pharmacist are randomly assigned.
3. **Login as Doctor**: Order "Penicillin" (Observe the AI warning). Order "Paracetamol" instead.
4. **Real-time Flow**: Watch the Pharmacy dashboard update instantly. Mark as "Dispensed".
5. **Nursing**: Log in as Nurse, see the medication schedule, and record vitals.
6. **Timeline**: Switch back to Admin to see the complete audit trail in the real-time timeline.

---
*Built for the Clinical Innovation Hackathon 2026.*
