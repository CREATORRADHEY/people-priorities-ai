# Local Deployment & Run Instructions

This document details the configuration steps required to compile, validate, and launch the **People's Priorities AI** services locally.

---

## 1. System Prerequisites

Before starting, install the following on your host machine:
* **Node.js**: Version `18.x` or later (recommending LTS)
* **Python**: Version `3.10.x` or later
* **Google Cloud SDK**: (If using Firestore in production or authenticating via Application Default Credentials)

---

## 2. Backend Installation Guide

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```
5. Configure `.env` variables:
   * `GEMINI_API_KEY`: Provide your Google AI Studio API Key.
   * `GEMINI_MODEL`: Set model string (defaults to `gemini-2.5-flash`).
   * `FIREBASE_PROJECT_ID`: Name of your target Firebase database.
6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will launch at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can check health via `curl http://127.0.0.1:8000/health`.

---

## 3. Frontend Installation Guide

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The application client will open at [http://localhost:5173](http://localhost:5173).

---

## 4. Test Verification Suite

The backend contains a complete suite of mock-isolated unit tests testing routing, parsing, priority math, and duplicate detection.

To run all tests from the backend directory:
```bash
.venv/bin/python -m pytest -v --tb=short
```

To compile and verify the frontend production bundle:
```bash
cd frontend
npm run build
```
