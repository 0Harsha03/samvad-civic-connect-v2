# Samvad - Civic Connect 🏛️

**Samvad** is a modern, full-stack civic issue reporting platform designed to bridge the gap between citizens and government authorities. It allows citizens to report local issues (like potholes, waste, or street light failures) and track their resolution in real-time.

---

## 🚀 Features

- **Citizen Dashboard**: Report new issues with location data, photos, and descriptions. Track existing reports.
- **Admin Command Center**: Authorities can manage, assign, and resolve reported issues.
- **Real-time Persistence**: Data is persisted in a PostgreSQL cloud database (Supabase).
- **Aesthetic Design**: Premium UI with glassmorphism, fluid animations (Framer Motion), and responsive layout.
- **Role-based Access**: Separate interfaces for Citizens and Government Staff.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Server**: Node.js + Express
- **ORM**: Sequelize
- **Database**: PostgreSQL (Supabase) / SQLite (Local fallback)
- **Validation**: Zod

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Supabase)

### 2. Local Setup

**Clone the repository:**
```sh
git clone <your-repo-url>
cd samvad-civic-connect
```

**Frontend Setup:**
```sh
npm install
# Create .env and add VITE_API_URL=http://localhost:5000
npm run dev
```

**Backend Setup:**
```sh
cd server
npm install
# Create .env and add your DATABASE_URL (see .env.example)
npm start
```

---

## 🌐 Deployment

### Database (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Copy the **Connection Pooler** URL (Transaction mode) and add it as `DATABASE_URL` in your backend environment variables.

### Backend (Render / Railway)
1. Link your GitHub repo.
2. Set the root directory to `server`.
3. Add environment variables: `DATABASE_URL`, `FRONTEND_URL`, `PORT`.
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Link your GitHub repo.
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add environment variable: `VITE_API_URL` (pointing to your deployed backend).

---

## 📝 Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: Port for the server (defaults to 5000).
- `FRONTEND_URL`: URL of your deployed frontend (for CORS).

### Frontend (.env)
- `VITE_API_URL`: URL of your deployed backend API.

---

## 📄 License
This project is licensed under the MIT License.
