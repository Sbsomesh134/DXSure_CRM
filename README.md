# DXSure CRM

DXSure CRM is a premium, enterprise-grade Customer Relationship Management system built with the MERN stack (MongoDB, Express, React, Node.js). It supports Role-Based Access Control (Admin & Employee) and includes full-suite CRM features like Client Management, Pettycash Tracking, Ticketing Systems, and Analytics Dashboards.

---

## 🚀 Technologies Used

**Frontend (`/client`)**
- React 19 (Vite)
- Tailwind CSS v3 & Framer Motion
- Zustand (Global State Management)
- Axios & React Router DOM

**Backend (`/server`)**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & Bcrypt
- MVC Architecture

---

## 📦 Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB locally installed, OR a MongoDB Atlas URI

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/dxsure_crm
   JWT_SECRET=super_secret_jwt_key_for_dxsure_crm
   JWT_EXPIRES_IN=30d
   ```
   *(Note: Replace `MONGO_URI` with your Atlas string if not running MongoDB locally).*
4. Seed the database with the default Admin and Employee users:
   ```bash
   node seeder.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:5173` and log in with either of the seeded accounts:
   - **Admin:** `admin@dxsure.com` / `password123`
   - **Employee:** `employee@dxsure.com` / `password123`

---

## ☁️ Deployment Instructions

### 1. MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add IP `0.0.0.0/0` (Allow access from anywhere).
3. Go to **Database Access** and create a database user.
4. Get your connection string (URI) and replace the `<password>` and `<dbname>`.

### 2. Backend Deployment (Render or Railway)
1. Push your code to GitHub.
2. Log in to [Render](https://render.com/) or [Railway](https://railway.app/).
3. Create a new **Web Service** and connect your GitHub repository.
4. **Root Directory:** `server`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.) in the dashboard settings.
8. Deploy! Note the resulting deployed backend URL (e.g., `https://dxsure-api.onrender.com`).

### 3. Frontend Deployment (Vercel or Netlify)
1. Log in to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
2. Create a new project and import your GitHub repository.
3. **Root Directory:** `client`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `<YOUR_DEPLOYED_BACKEND_URL>/api` (e.g., `https://dxsure-api.onrender.com/api`)
8. Deploy!

> **Note:** For single-page applications (SPAs) on Vercel/Netlify, ensure you configure URL rewrites for React Router so that navigating directly to routes like `/admin` doesn't throw a 404 error. For Vercel, you can add a `vercel.json` file in the `client` directory:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

---

## 🎨 Theme & UI
The application uses a customized Tailwind CSS configuration specifically designed for modern SaaS platforms, incorporating **glassmorphism**, **soft box-shadows**, and **smooth transitions**. The global state management is handled elegantly by `Zustand`.
