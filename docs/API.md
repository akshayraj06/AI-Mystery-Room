# AI Mystery Room — REST API Specification

**Base URL:** `/api/v1`  
**Data Format:** `application/json`

---

## 1. System Health

### `GET /api/v1/health`
Confirms the backend process is running.

**Response `200 OK`:**
```json
{
  "status": "ok"
}
```

---

## 2. Mystery Generation

### `POST /api/v1/mysteries`
Initiates an asynchronous investigation generation job.

**Request Body:**
```json
{
  "premise": "A lead cryptography researcher is found unconscious inside a vault during a keynote...",
  "genre": "crime",
  "difficulty": "medium",
  "suspectCount": 4,
  "setting": "Tech Headquarters, Zurich",
  "tone": "realistic suspense"
}
```

**Response `202 Accepted`:**
```json
{
  "jobId": "job_a1b2c3d4e5f6",
  "status": "queued",
  "statusUrl": "/api/v1/generation-jobs/job_a1b2c3d4e5f6"
}
```

### `GET /api/v1/generation-jobs/:jobId`
Polls the progress of a generation job.

**Response `200 OK` (In Progress):**
```json
{
  "jobId": "job_a1b2c3d4e5f6",
  "status": "generating",
  "progressStage": "creating_evidence",
  "mysteryId": null
}
```

**Response `200 OK` (Complete):**
```json
{
  "jobId": "job_a1b2c3d4e5f6",
  "status": "ready",
  "progressStage": "ready",
  "mysteryId": "653b1f89c02e1a4d98e1b234"
}
```

---

## 3. Case Exploration

### `GET /api/v1/mysteries/:mysteryId`
Retrieves public case details, suspects, timeline, and evidence list.
*(Note: Canonical culprit ID and protected solution object are strictly scrubbed).*

**Response `200 OK`:**
```json
{
  "_id": "653b1f89c02e1a4d98e1b234",
  "title": "The Silicon Vault Incident",
  "premise": "A lead researcher...",
  "genre": "crime",
  "difficulty": "medium",
  "caseBrief": "Full investigation briefing...",
  "incident": {
    "description": "...",
    "location": "Zurich",
    "incidentTime": "2026-10-25T20:45:00Z"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Dr. Evelyn Cross",
      "role": "Chief Archivist",
      "background": "...",
      "motive": "...",
      "alibi": "...",
      "publicFacts": ["..."]
    }
  ],
  "timeline": [
    {
      "id": "event_1",
      "timestamp": "2026-10-25T20:15:00Z",
      "description": "...",
      "relatedSuspectIds": ["suspect_1"],
      "relatedEvidenceIds": ["evidence_chat_1"],
      "isConfirmed": true
    }
  ],
  "evidence": [
    {
      "id": "evidence_chat_1",
      "type": "chat",
      "title": "Recovered Messaging Log",
      "summary": "...",
      "content": {},
      "relatedSuspectIds": ["suspect_1"],
      "timelineEventIds": ["event_1"],
      "clueType": "direct",
      "importance": "critical",
      "sourceDescription": "Burner phone dump",
      "fictional": true
    }
  ]
}
```

---

## 4. Investigation Sessions & Progress

### `POST /api/v1/mysteries/:mysteryId/sessions`
Creates an anonymous investigation session.

**Response `201 Created`:**
```json
{
  "sessionId": "653b20acc02e1a4d98e1b567",
  "mysteryId": "653b1f89c02e1a4d98e1b234",
  "token": "4f9d2a...",
  "status": "active"
}
```

### `GET /api/v1/sessions/:sessionId`
Retrieves session state, discovered evidence IDs, bookmarks, notes, and verdict if submitted.

### `GET /api/v1/sessions/:sessionId/evidence/:evidenceId`
Inspects a specific evidence artifact and automatically marks it discovered.

### `PATCH /api/v1/sessions/:sessionId/progress`
Updates discovered evidence, bookmarked clues, or private detective notes.

**Request Body:**
```json
{
  "bookmarkedEvidenceIds": ["evidence_chat_1"],
  "notes": "Verified that suspect 1's alibi conflicts with CCTV camera 4."
}
```

---

## 5. Final Verdict Submission

### `POST /api/v1/sessions/:sessionId/verdict`
Evaluates the player's accusation against the canonical culprit ID and reveals the canonical master solution.

**Request Body:**
```json
{
  "culpritId": "suspect_2"
}
```

**Response `200 OK`:**
```json
{
  "correct": true,
  "selectedSuspectId": "suspect_2",
  "score": 95,
  "solution": {
    "culpritId": "suspect_2",
    "culpritName": "Marcus Vance",
    "motive": "...",
    "method": "...",
    "opportunity": "...",
    "timelineExplanation": "...",
    "evidenceReasoning": [
      {
        "evidenceId": "evidence_chat_1",
        "explanation": "..."
      }
    ],
    "redHerringExplanation": "..."
  }
}
```

---

## 6. Error Response Format (Spec §12.9)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid mystery premise."
  }
}
```
