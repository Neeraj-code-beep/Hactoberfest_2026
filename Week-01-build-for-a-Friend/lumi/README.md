# ✨ Lumi — Little Things Companion

> Built with care for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend**.

---

## 🌟 The Story & Idea

In the flow of busy college lectures, deep work, and everyday moments, it's easy to get distracted and forget the little thoughts we wanted to share later, or even forget to eat or hydrate.

**Lumi** is a warm, personal AI companion designed to act as an intelligent decision and organization layer:
- **Quick Natural Thought Capture**: Type freely in Hindi, Hinglish, or English.
- **Things to tell Neeraj**: Queues funny moments, questions, and reminders for the next conversation.
- **Memories Timeline**: Keeps track of small sweet moments and peaceful discoveries.
- **Gentle Self-Care**: Soft check-ins for meals and hydration without stressful alarms.

---

## 🧠 Core AI Concept (Gemma + Ollama Integration)

Lumi uses the **Gemma 2 open-weight model** running locally on **Ollama** for structured intent extraction:

```text
User Natural-Language Input
         │
         ▼
    GemmaService
         │
         ▼
  Ollama (gemma2:2b)
         │
         ▼
  Structured Intent Extraction
  {
    "intent": "tell_later",
    "recipient": "Neeraj",
    "category": "college",
    "content": "Something funny happened in class today",
    "priority": "normal"
  }
         │
         ▼
  Validation & MongoDB Persistence
         │
         ▼
  Warm Interactive UI
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, TanStack Query, Axios
- **Backend**: Node.js, Express, REST API, Mongoose
- **Database**: MongoDB
- **AI**: Google Gemma 2 2B Instruct (`gemma2:2b`) running locally via Ollama

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Ollama (`ollama pull gemma2:2b`)
- MongoDB (optional for offline preview mode; connects automatically when running)

### 1. Ollama & Gemma Setup
```bash
ollama serve
ollama pull gemma2:2b
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
