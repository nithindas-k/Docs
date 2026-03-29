<div align="center">
  <a href="https://docs-nithin.vercel.app">
    <img src="./frontend/public/pwa-512x512.png" alt="Lockr Logo" height="200" />
  </a>
  <h1>Lockr - Secure Personal & Family Vault</h1>
  <p>
    <strong>Live Demo:</strong> 
    <a href="https://docs-nithin.vercel.app">docs-nithin.vercel.app</a>
  </p>
</div>

---

## Project Overview

Lockr is a premium, high-security digital vault designed to organize and protect your most important documents. Whether it's personal identification, medical records, or family archives, Lockr provides a seamless and visually stunning interface to manage your digital life with confidence.

Built with a focus on user experience, Lockr features immersive 3D animations, a responsive global search, and a robust member-based archiving system that ensures every document is exactly where it needs to be.

---

## Key Features

### For Individuals

- **Personal Vault:** Securely store and categorize personal documents with ease.
- **Global Search:** Find any document in seconds with our lightning-fast, reactive search.
- **Secure Uploads:** Multi-format support (Images, IDs, PDFs) with Cloudinary integration.
- **Smart Categorization:** Organize files by type, priority, or custom categories.

### For Families

- **Family Archive:** Create and manage profiles for family members.
- **Member-Specific Filtering:** Bridge the gap between individual and collective records.
- **Safe Sharing:** (In Development) Securely share access with trusted family members.
- **Centralized Management:** Keep everyone's important documents in one secure location.

### Core Functionalities

- **Immersive UI:** 3D animated cards, glassmorphism, and smooth scrolling (Lenis).
- **Google OAuth:** One-click secure sign-in for seamless onboarding.
- **Cloudinary Storage:** Encrypted-at-rest storage for all your media and documents.
- **Responsive Design:** Optimized for a premium experience on both desktop and mobile.
- **State Persistence:** Persistent vault context using Redux Toolkit.

---

## Technology Stack

### Frontend

- **Core:** React 18, TypeScript, Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS, Radix UI (shadcn/ui)
- **Animations:** Framer Motion, GSAP, Three.js (WebGL Shaders)
- **UX:** Lenis Scroll, Sonner (Toasts), Lucide Icons
- **Communication:** Axios

### Backend

- **Runtime:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Google OAuth (google-auth-library)
- **Storage:** Cloudinary, Multer
- **Validation:** Type-safe API responses

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for file storage
- Google Cloud Console project (for OAuth)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lockr
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

---

## Project Structure

```text
Lockr/
├── backend/            # Express server with TypeScript
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API routes
│   │   └── server.ts   # Entry point
├── frontend/           # React application with Vite
│   ├── src/
│   │   ├── components/ # UI & Layout components
│   │   ├── store/      # Redux state management
│   │   ├── pages/      # Page views
│   │   └── App.tsx     # Root component
└── README.md           # Main project documentation
```

---

## License

This project is licensed under the ISC License.
