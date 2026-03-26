# Dhanvantari — Full Stack React + Node.js + MySQL

A complete online treatment platform with separate Patient and Doctor flows,
appointment approval system, and Google Meet integration.

---

## Project Structure

```
dhanvantari/
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── index.js                    Entry point
│       ├── App.jsx                     Router + layout
│       ├── styles/globals.css          Design system
│       ├── context/AuthContext.jsx     Auth state + mock data
│       ├── components/UI.jsx           Shared components
│       └── pages/
│           ├── LandingPage.jsx         Public home
│           ├── auth/
│           │   ├── LoginPage.jsx
│           │   ├── RegisterPatientPage.jsx
│           │   └── RegisterDoctorPage.jsx
│           ├── patient/
│           │   ├── PatientHome.jsx
│           │   ├── FindDoctorsPage.jsx
│           │   ├── PatientAppointmentsPage.jsx
│           │   └── RecordsPage.jsx
│           └── doctor/
│               ├── DoctorHome.jsx
│               ├── DoctorAppointmentsPage.jsx
│               └── DoctorProfilePage.jsx
├── backend/
│   ├── server.js
│   ├── env.example                     Copy to .env
│   ├── config/db.js
│   ├── middleware/auth.js
│   └── routes/
│       ├── auth.js
│       ├── doctors.js
│       ├── appointments.js
│       ├── prescriptions.js
│       └── notifications.js
└── database/schema.sql
```

---

## Setup

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
cp env.example .env        # fill in DB credentials
npm install
npm run dev
# API: http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

---

## Demo Login

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Patient | patient@demo.com   | Patient@123 |
| Doctor  | doctor@demo.com    | Doctor@123  |

Use the "Auto-fill Demo Credentials" button on the login page.

---

## Appointment Flow

```
Patient books  →  status: pending
Doctor approves  →  status: approved + Google Meet link shared
Both join Google Meet at appointment time
Doctor marks Complete  →  status: completed + adds notes
Doctor writes Prescription  →  Patient views in Records
```

---

## Pages

| Page                     | Role    | Description                              |
|--------------------------|---------|------------------------------------------|
| /landing                 | Public  | Marketing home page                      |
| /login                   | Public  | Patient or Doctor sign in                |
| /register-patient        | Public  | 2-step patient registration              |
| /register-doctor         | Public  | 2-step doctor registration               |
| Patient: Home            | Patient | Stats, upcoming appointments, quick nav  |
| Patient: Find Doctors    | Patient | Filter, search, book with 2-step flow    |
| Patient: Appointments    | Patient | View all with status, Join Meet button   |
| Patient: Records         | Patient | Prescriptions, lab reports, vaccines     |
| Doctor: Home             | Doctor  | Pending approvals, upcoming sessions     |
| Doctor: Appointments     | Doctor  | Approve / Reject / Complete              |
| Doctor: Profile          | Doctor  | Update Meet link, fee, availability      |

---

## Tech Stack

- Frontend: React 18, CSS Variables, Create React App
- Backend: Node.js, Express 4
- Database: MySQL 8 with mysql2
- Auth: JWT + bcrypt
- Video: Google Meet (link-based integration)
