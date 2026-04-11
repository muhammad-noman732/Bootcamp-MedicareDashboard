# 🏥 Medicare Dashboard

A modern, full-stack medical management system designed for healthcare practitioners to manage patients, schedule appointments, track tasks, and visualize medical data in a streamlined dashboard.

## 🚀 Features

- **🔐 Robust Authentication**
  - Secure Email/Password authentication with OTP verification.
  - Google OAuth integration for seamless social login.
  - JWT Access and Refresh token lifecycle for high security.
- **📋 Patient Management**
  - Comprehensive patient records (diagnosis, history, status).
  - Track treatment progress: *On Treatment*, *Recovered*, or *Awaiting Surgery*.
- **📅 Appointment Scheduling**
  - Real-time scheduling with FullCalendar integration.
  - Intelligent slot validation to prevent double-booking.
  - Automated notifications for new or cancelled appointments.
- **📊 Advanced Analytics**
  - Interactive charts and reports using Recharts.
  - Real-time statistics for patient load, surgery queues, and recovery rates.
- **✅ Task Management**
  - Dedicated medical todo list for practitioners to track daily duties.
- **🖼️ Profile & Onboarding**
  - Professional onboarding flow for medical staff.
  - Image uploads via Cloudinary for doctor profiles and patient records.

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite**
- **Tailwind CSS 4** & **Radix UI** (Premium Styling)
- **Redux Toolkit** (Global State Management)
- **React Hook Form** & **Zod** (Type-safe Validations)
- **FullCalendar** & **Recharts**

### Backend
- **Node.js** & **Express 5**
- **TypeScript**
- **Prisma ORM** with **MongoDB**
- **SendGrid** (Email Services)
- **Cloudinary** (Media Management)
- **Helmet**, **HPP**, & **Express Rate Limit** (Security)

---

## 🏗️ Project Structure

```text
├── backend/                # Express TypeScript Server
│   ├── prisma/             # MongoDB Schema & Client
│   ├── routes/             # API Endpoints
│   ├── services/           # Business Logic Layer
│   └── repositories/       # Data Access Layer
├── frontend/               # React Vite Application
│   ├── src/components/     # Reusable UI Components
│   ├── src/pages/          # Dashboard & Auth Views
│   └── src/lib/store/      # RTK Query Services & State
└── package.json            # Monorepo Workspace Configuration
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- SendGrid API Key (for emails)
- Cloudinary Account (for image uploads)
- Google Cloud Project (for Google Auth)

### 1. Clone & Install
```bash
git clone https://github.com/muhammad-noman732/Bootcamp-MedicareDashboard.git
cd Bootcamp-MedicareDashboard
npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DATABASE_URL="your_mongodb_url"
JWT_ACCESS_SECRET="your_secret"
JWT_REFRESH_SECRET="your_secret"
JWT_VERIFY_SECRET="your_secret"

# Email Service
SENDGRID_API_KEY="your_api_key"
SENDGRID_FROM_EMAIL="your_email"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Google Auth
GOOGLE_CLIENT_ID="your_google_client_id"

ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Database Initialization
```bash
# Generate Prisma Client
npm run postinstall
```

### 4. Running the Project
#### Development Mode
```bash
# Run both frontend and backend concurrently
npm run dev:frontend
npm run dev:backend
```

---

## 🧪 Testing
The project includes **Cypress** for end-to-end testing.
```bash
# Open Cypress runner
npm run cy:open

# Run tests in headless mode
npm run cy:run
```

---

## 📜 License
This project is licensed under the ISC License.

---
Created with ❤️ by [Muhammad Noman](https://github.com/muhammad-noman732)
