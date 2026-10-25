# AI Mystery Room — Development & Architecture Guide

## 1. Architectural Stack

- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, Lucide React.
- **Backend:** Node.js v24+, Express.js (ES modules), Mongoose 8.
- **AI Provider:** Google Gemini (`@google/generative-ai` & `@google/genai`) with built-in zero-config scenario generator fallback.
- **Database:** MongoDB with automatic embedded `mongodb-memory-server` fallback for zero-dependency local development and testing.

---

## 2. Directory Structure

```text
AI Mystery Room/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── app/                # App.jsx, router.jsx
│   │   ├── components/         # Reusable UI & Investigation widgets
│   │   │   ├── layout/         # Navbar, Footer, Layout
│   │   │   └── investigation/  # Briefing, Suspects, EvidenceRoom, Timeline, Notes
│   │   ├── pages/              # Landing, Create, Generation, Investigation, Verdict
│   │   ├── services/           # api.js client
│   │   ├── styles/ & index.css # Dark investigation room design tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # db.js, env.js
│   │   ├── controllers/        # mysteryController.js, sessionController.js
│   │   ├── middleware/         # errorHandler.js
│   │   ├── models/             # Mystery, InvestigationSession, GenerationJob
│   │   ├── routes/             # api.js, health.js
│   │   ├── services/           # geminiService, mysteryGenerator, consistencyValidator, verdictService
│   │   ├── validators/         # mysteryValidator.js (Zod)
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                  # Automated integration & unit tests
│   └── package.json
│
├── docs/                       # Specifications & Documentation
│   ├── SPEC.md                 # Master Specification Sheet (SSOT v1.0)
│   ├── API.md                  # REST API contract
│   └── DEVELOPMENT.md
│
├── .env.example
├── .gitignore
├── package.json                # Monorepo development scripts
└── README.md
```

---

## 3. Core Game Logic Guarantees

1. **Predetermined Canonical Culprit:**
   The culprit ID is locked at generation time and stored in the protected `solution` subdocument. The client cannot read the culprit ID until after submitting a verdict.
2. **Server-Authoritative Evaluation:**
   Verdicts compare immutable IDs, never freeform text.
3. **Resilience & Fallbacks:**
   - If `MONGODB_URI` is unset or unavailable, the backend automatically uses an embedded in-memory database instance.
   - If `GEMINI_API_KEY` is unset or unavailable, the backend automatically generates rich, schema-compliant cases via `localScenarioEngine.js`.
