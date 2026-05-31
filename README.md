# 📓 Discipline Tracker

> *"Discipline today, freedom tomorrow."*

A full-stack habit tracker inspired by notebook journalling. Black & white aesthetic, 3-column habit table, streak counter, score, star rating, and daily reflection — backed by MongoDB.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |

---

## Project Structure

```
discipline-tracker/
├── backend/
│   ├── src/
│   │   ├── models/DayLog.ts      ← Mongoose schema
│   │   ├── routes/days.ts        ← All API routes
│   │   └── index.ts              ← Express entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/index.ts          ← Axios API client
│   │   ├── components/
│   │   │   ├── TrackerPage.tsx   ← Main page
│   │   │   ├── HabitRow.tsx      ← Single habit row
│   │   │   ├── ScoreBar.tsx      ← Score + progress
│   │   │   ├── StarRating.tsx    ← Day rating
│   │   │   └── HistoryPanel.tsx  ← Slide-out history
│   │   ├── hooks/useDayLog.ts    ← All state + API logic
│   │   ├── types/index.ts        ← Shared TypeScript types
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts            ← Proxies /api → :5000
│
└── package.json                  ← Root convenience scripts
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) **OR** a MongoDB Atlas URI

### 1. Clone / unzip the project

```bash
cd discipline-tracker
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI if using Atlas
npm install
npm run dev
# → Server on http://localhost:5000
```

### 3. Set up the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# → App on http://localhost:5173
```

### 4. Open the app

Visit **http://localhost:5173**

---

## Environment Variables (backend/.env)

```env
MONGODB_URI=mongodb://localhost:27017/discipline-tracker
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/discipline-tracker
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/days` | List all logged days |
| GET | `/api/days/streak` | Get current streak count |
| GET | `/api/days/:dateKey` | Get or auto-create a day |
| PATCH | `/api/days/:dateKey` | Update reflection / rating |
| POST | `/api/days/:dateKey/habits` | Add a habit |
| PATCH | `/api/days/:dateKey/habits/:habitId` | Update name / done / note |
| DELETE | `/api/days/:dateKey/habits/:habitId` | Delete a habit |

`dateKey` format: `YYYY-MM-DD` (e.g. `2025-06-01`)

---

## Features

- ✓ / ✗ / blank — three-state habit toggle (click cycles through)
- Up to **30 habits** per day
- Habits carry over from the previous day automatically
- **Streak counter** — counts consecutive days ≥ 50% completion
- **Score** shown as fraction + percentage with progress bar
- **Day rating** — 1–5 stars
- **Reflection** section with lined-paper styling
- **History panel** — slide-out drawer showing all past days
- Debounced saving on text inputs (reflection, habit names, notes)
- Optimistic UI updates with automatic revert on error
- Toast notifications for errors

---

## Production Build

```bash
# Build backend
cd backend && npm run build

# Build frontend (outputs to frontend/dist)
cd frontend && npm run build

# Serve frontend dist with any static file server or nginx
# Point nginx → frontend/dist for static, /api → backend:5000
```

---

*Built with the notebook aesthetic of handwritten habit trackers.*
