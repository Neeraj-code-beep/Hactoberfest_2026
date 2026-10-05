# ✨ Lumi — Ashmita's Little Things Companion

> Built with love for **Ashmita** for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend**.

---

## 🌟 The Story & Idea

Ashmita often has little thoughts she wants to remember or tell Dheeraj later. In the flow of busy college lectures, deep work, and conversations, she can get distracted and forget those little moments. Sometimes she even gets so busy that she forgets to eat or hydrate.

**Lumi** is a warm, personal AI companion designed specifically for Ashmita. Rather than acting as a generic chatbot, Lumi acts as an intelligent decision and organization layer:
- **Quick Natural Thought Capture**: Type freely in Hindi, Hinglish, or English.
- **Tell Dheeraj Later**: Queues funny moments, questions, and reminders for her next conversation with Dheeraj.
- **Memories Timeline**: Keeps track of small sweet moments and peaceful discoveries.
- **Gentle Self-Care**: Soft check-ins for meals and hydration without stressful alarms.

---

## 🧠 Core AI Concept (Gemma Integration)

Lumi uses the **Gemma open-weight model** as a structured intent extraction engine:

```text
User Natural-Language Input
         │
         ▼
  Gemma Open-Weight Model
         │
         ▼
  Structured Intent Extraction
  {
    "intent": "tell_later",
    "recipient": "Dheeraj",
    "category": "college",
    "content": "...",
    "priority": "normal"
  }
         │
         ▼
  Application Action & MongoDB Persistence
         │
         ▼
  Warm Interactive UI
```

The AI layer is strictly modularized (`server/services/gemma/`) so different local runtimes (Ollama, vLLM, HuggingFace) or providers can be plugged in seamlessly.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, TanStack Query, Axios
- **Backend**: Node.js, Express, REST API, Mongoose
- **Database**: MongoDB
- **AI**: Gemma Open-Weight Model Engine (Modular Adapter)

---

## 📁 Monorepo Project Structure

```text
lumi/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # Shared UI components (Header, StatusBadge)
│   │   ├── features/           # Domain feature modules
│   │   │   ├── quickCapture/   # Natural language thought capture
│   │   │   ├── tellLater/      # "Tell Dheeraj Later" queue
│   │   │   ├── checkins/       # Gentle nourishment & hydration tracker
│   │   │   └── memories/       # Personal memory timeline
│   │   ├── hooks/              # Custom React Query hooks (useHealth)
│   │   ├── lib/                # Shared utilities & theme helpers
│   │   ├── pages/              # Page layouts (HomePage)
│   │   ├── services/           # Axios API services
│   │   ├── App.jsx             # Root application component
│   │   ├── main.jsx            # Entrypoint
│   │   └── index.css           # Tailwind design tokens & typography
│   └── vite.config.js          # Vite config with API proxy
│
├── server/                     # Backend Express REST API
│   ├── config/                 # DB & environment configuration
│   ├── controllers/            # Request handlers (health, etc.)
│   ├── middleware/             # Error handlers & request loggers
│   ├── models/                 # Mongoose schemas & data models
│   ├── routes/                 # Express API routes (/api/health, etc.)
│   ├── services/
│   │   └── gemma/              # Modular Gemma AI adapter
│   ├── utils/                  # Structured logger & utilities
│   └── server.js               # Express application entrypoint
│
├── .env.example                # Sample environment variables
├── .gitignore                  # Monorepo gitignore
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (optional for local mock preview mode; required for persistent DB actions)

### 1. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
The backend starts on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend starts on `http://localhost:5173` and proxies API requests to the backend.

---

## 💖 Design Aesthetics
Lumi is styled with a warm cream neutral background (`#FAF7F2`), soft blush/rose accents (`#E88388`, `#FFF1F2`), and gentle serif/sans typography (`Outfit`, `Plus Jakarta Sans`, `Lora`) designed to feel like a heartfelt personal companion.
