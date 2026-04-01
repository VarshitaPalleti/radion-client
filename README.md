# 🫁 RADION: AI-Augmented Lung Cancer Diagnostic Platform

> **"Breath is life—protect your lungs, protect your future."**
> Radion is a modern, secure, and user-centric web platform that bridges the gap between complex medical imaging AI and actionable clinical insights. 

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack & Justification](#-technology-stack--justification)
4. [User Roles & Features](#-user-roles--features)
5. [Core Workflows (Data Flow)](#-core-workflows-data-flow)
6. [Database Schema (Firestore)](#-database-schema-firestore)
7. [Environment Setup & Installation](#-environment-setup--installation)
8. [Project Directory Structure](#-project-directory-structure)

---

## 🌍 Project Overview
Lung cancer detection often involves significant waiting periods and complex medical jargon that leaves patients anxious and confused. **Radion** solves this by providing a dual-sided platform:
* **For Patients:** A calming, intuitive portal to securely upload CT/X-ray scans, instantly receive a preliminary AI risk assessment (with simplified visual reports), and track their clinical history.
* **For Doctors:** A professional dashboard to review AI-flagged scans, verify diagnostic results, and manage a queue of patient records.

**Disclaimer:** *Radion is an AI-assisted screening tool designed to support, not replace, professional medical diagnosis.*

---

## 🏗 System Architecture
Radion employs a decoupled, serverless microservices architecture. We separated the "Web/Business Logic" from the "Machine Learning Engine" to ensure scalability and fault tolerance.

1. **The Client (Frontend):** Next.js handles the UI, routing, and role-based access control.
2. **The BaaS (Backend-as-a-Service):** Firebase handles Authentication, NoSQL data storage, and binary file storage (scans).
3. **The AI Engine (Microservice):** A standalone Python FastAPI server running a Deep Learning model (e.g., ResNet/CNN). It accepts images, runs inference, and returns JSON predictions alongside a dynamically generated Base64 visual report.

---

## 💻 Technology Stack & Justification

| Layer | Technology | Why we chose it for Radion |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | Industry-standard React framework. Provides seamless file-based routing (crucial for isolating `/patient` vs `/doctor` routes) and high performance. |
| **Language** | **TypeScript** | Strict typing prevents runtime errors. Crucial for handling complex medical objects (e.g., ensuring `bmi` is calculated correctly as a number, not a string). |
| **Styling** | **Tailwind CSS** | Enabled the rapid development of Radion's signature "Dark Mode Glassmorphism" aesthetic (translucent cards, glowing gradients) without bloated CSS files. |
| **Authentication** | **Firebase Auth (Google OAuth)** | Eliminates the security risks of storing manual passwords. Provides instant, frictionless onboarding with verified emails. |
| **Database** | **Firestore (NoSQL)** | Highly scalable, real-time database. The document-based structure is perfect for storing flexible medical profiles (allergies, variable vitals). |
| **Blob Storage** | **Firebase Storage** | Secure, scalable bucket for storing high-resolution X-Rays/CT Scans (PNG/JPG/DICOM). |
| **AI Backend** | **Python + FastAPI** | FastAPI is lightning-fast and natively asynchronous. It is the gold standard for serving Machine Learning models via HTTP endpoints with built-in CORS support. |

---

## 👥 User Roles & Features

The platform utilizes strict **Role-Based Access Control (RBAC)** managed via a global React `AuthContext`.

### 1. Patient Portal (`role: "PATIENT"`)
* **Dynamic Medical Profile:** Users can view and edit their biometric vitals (Height, Weight). The system auto-calculates BMI in real-time.
* **Smart Upload (`/predict`):** Drag-and-drop interface for scan uploads. 
* **Instant AI Inference:** Displays a sliding UI containing the AI confidence score, prediction (Malignant/Benign), and a highly detailed Base64 rendered medical report image directly from the Python backend.

### 2. Doctor Console (`role: "DOCTOR"`)
* **Clinical Verification:** Doctors register using their official Medical License Number.
* **Verification Status:** Profiles display a "Verified" or "Pending Review" badge to ensure platform integrity.
* **Review Queue (WIP):** A dedicated dashboard to pull `PENDING_REVIEW` scans from Firestore, allowing the doctor to validate the AI's findings and append clinical notes.

---

## 🔄 Core Workflows (Data Flow)

### 1. The "Magic Trick" Registration Flow
Traditional apps force users to create an account *before* filling out their profile. Radion flips this for better UX:
1. User fills out the extensive medical form (Vitals, Allergies, etc.) on the frontend.
2. User clicks **"Sign In & Complete Registration"**.
3. Google Auth popup appears.
4. Upon successful Google authentication, the app captures the new `user.uid`.
5. The local form data is instantly merged with the Google Identity (Email, Name) and pushed to Firestore in a single transaction using `{ merge: true }` to prevent data overwriting.

### 2. The AI Prediction Pipeline (`/predict`)
When a patient uploads a scan, the following multi-stage pipeline executes:
1. **Validation:** Frontend verifies file size (<10MB) and format.
2. **AI Inference:** The image is wrapped in a `FormData` object and POSTed to the local FastAPI model (`http://localhost:8000/predict`).
3. **Storage:** Simultaneously, the raw image is uploaded to Firebase Storage, generating a secure `downloadURL`.
4. **Database Logging:** The AI response (Prediction, Confidence) + the Firebase `downloadURL` are combined and saved to the Firestore `history` collection under the patient's ID.
5. **UI Update:** The React state updates, hiding the upload box and revealing the analytical results alongside the Base64 generated report image.

---

## 🗄 Database Schema (Firestore)

Radion uses a NoSQL document structure. 

### Collection: `users`
Document ID: `{Google_Auth_UID}`
```json
{
  "name": "Sarah Connor",
  "email": "sarah@gmail.com",
  "role": "PATIENT", // or "DOCTOR"
  "dob": "1998-05-12",
  "bloodGroup": "O+",
  "weight": "65",
  "height": "170",
  "bmi": "22.49",
  "allergies": "Penicillin",
  "diseases": "None",
  "createdAt": "2024-05-20T10:00:00Z"
}
```
*(Note: Doctor documents contain `licenseNumber`, `specialization`, and `isVerified` flags instead of vitals).*

### Collection: `history`
Document ID: `{Auto_Generated_ID}`
```json
{
  "patientId": "user_123_uid",
  "imageUrl": "https://firebasestorage.googleapis.com/.../scan.png",
  "prediction": "MALIGNANT",
  "confidence": "92.5%",
  "isCancer": true,
  "status": "PENDING_REVIEW",
  "createdAt": "2024-05-20T10:15:00Z"
}
```

---

## ⚙️ Environment Setup & Installation

### Prerequisites
* Node.js (v18+)
* Python (v3.9+) for the AI Model
* A Firebase Project (Auth, Firestore, Storage enabled)

### 1. Web Client Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/radion.git
cd radion
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

### 3. Start the Application
**Start the Next.js Frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Start the FastAPI Backend (Assuming it is in a `/model` folder):**
```bash
cd model
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

---

## 📁 Project Directory Structure
```text
radion/
├── app/
│   ├── (public)/              # Open routes
│   │   ├── page.tsx           # Landing Page
│   │   ├── login/page.tsx     # Smart Login
│   │   └── register/          # Patient & Doctor forms
│   ├── patient/               # Protected Patient Routes
│   │   ├── profile/page.tsx   # Dynamic Vitals Dashboard
│   │   └── predict/page.tsx   # AI Upload & Results UI
│   ├── doctor/                # Protected Doctor Routes
│   │   └── profile/page.tsx   # Verification Dashboard
│   ├── layout.tsx             # Root layout wrapping AuthContext
│   └── globals.css            # Tailwind directives & theme
├── components/
│   └── Navbar.tsx             # Dynamic Role-Based Navbar
├── context/
│   └── AuthContext.tsx        # Firebase Auth State Manager
├── lib/
│   └── firebase.ts            # Firebase App Initialization
└── public/                    # Static assets (backgrounds, SVGs)
```

---
*Designed & Developed for the future of clinical AI.*