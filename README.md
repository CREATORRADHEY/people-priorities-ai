# People's Priorities AI

People's Priorities AI is a multilingual AI-powered decision intelligence platform for constituency development planning. It acts as an intelligence layer that transforms fragmented citizen feedback (voice, text, images), public datasets, and infrastructure information into explainable, evidence-backed constituency development priorities for Members of Parliament (MPs) and constituency planning offices.

---

## Technology Stack

The platform is designed around a vertical slice architecture:

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: FastAPI + Pydantic + Uvicorn
- **Database**: Firestore (operational storage)
- **Object Storage**: Firebase Storage (multimodal raw assets like images and voice audio)
- **AI Engine**: Gemini API (`gemini-2.5-flash` for extraction, `gemini-2.5-pro` for decision briefs)
- **Vector Search**: ChromaDB (semantic similarity matching & clustering)
- **Analytics**: BigQuery (census & infrastructure public datasets)
- **Containers**: Docker / Docker Compose

---

## Repository Folder Structure

```
people-priorities-ai/
├── Docs/                    # LOCKED Product Specs & Architectural Blueprints
├── backend/                 # FastAPI Backend Service
│   ├── app/
│   │   ├── api/             # API Router definitions & dependencies
│   │   ├── core/            # Central Config, Logging, Security
│   │   ├── db/              # Firestore database models & repositories
│   │   ├── ai/              # Prompt versioning & Gemini SDK initializers
│   │   ├── models/          # DB structures mapping canonical business objects
│   │   ├── schemas/         # FastAPI/Pydantic request & response validators
│   │   ├── repositories/    # Database query abstractions
│   │   ├── services/        # Pipeline orchestrations
│   │   ├── middleware/      # Performance, correlation IDs, logging middleware
│   │   ├── utils/           # Time, serialization helpers
│   │   ├── tests/           # Testing suite
│   │   └── main.py          # FastAPI server entrypoint
│   ├── .env.example         # Template env file for backend
│   └── requirements.txt     # Backend python dependencies
├── frontend/                # React Frontend Service
│   ├── src/
│   │   ├── app/             # Application Shell & Theme setup
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Shared common & UI modules
│   │   ├── features/        # Slice folders (dashboard, maps, priority, submission)
│   │   ├── hooks/           # Shared custom React hooks
│   │   ├── layouts/         # Page templates
│   │   ├── lib/             # Firebase / Gemini SDK configurations
│   │   ├── routes/          # Navigation paths
│   │   ├── services/        # Server API clients
│   │   ├── styles/          # Tailwind setup
│   │   ├── types/           # TypeScript interfaces & enums
│   │   ├── utils/           # Formatting & utility helpers
│   │   └── main.tsx         # React application entrypoint
│   ├── .env.example         # Template env file for frontend
│   ├── index.html           # Vite root page
│   ├── package.json         # Node.js dependencies & scripts
│   ├── postcss.config.js    # PostCSS configs
│   ├── tailwind.config.ts   # Tailwind styling configurations
│   └── tsconfig.json        # TypeScript compiler configurations
├── shared/                  # Shared JSON schemas, contracts, constants
│   ├── constants/
│   ├── types/
│   └── schemas/
├── infra/                   # Deployment configs & Dockerfiles
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   └── frontend.Dockerfile
│   ├── firebase/
│   └── deployment/
├── scripts/                 # Automation & validation scripts
│   └── verify_connections.py# Standalone script to test connection to Firebase/Gemini
├── .dockerignore            # Docker compilation exclude file
├── .gitignore               # Untracked files list
├── docker-compose.yml       # Docker orchestrator
├── LICENSE                  # Project License (MIT)
└── README.md                # This file
```

---

## Local Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Docker (optional)

### Backend Setup
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
4. Copy the environment configuration and fill in real values (or use local mock fallbacks):
   ```bash
   cp .env.example .env
   ```
5. Run the server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will start at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can verify health via:
   ```bash
   curl http://127.0.0.1:8000/health
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Run the React application:
   ```bash
   npm run dev
   ```
   The client application will start at [http://localhost:5173](http://localhost:5173).

---

## Running with Docker Compose

To spin up both frontend and backend inside containers:
```bash
docker compose up --build
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)

---

## Known Local Environment Issues

### ⚠️ Docker Desktop containerd Socket Error (macOS)
If running `docker compose build` fails with:
`ERROR: request returned 500 Internal Server Error for API route ... check if the server supports the requested API version` or similar containerd I/O locks:
1. Open **Docker Desktop**.
2. Go to **Troubleshoot (Bug icon)** at the top bar.
3. Click **Clean / Purge data** or **Reset to factory defaults**.
4. Once completed, re-run the build command.

---

## License
MIT
