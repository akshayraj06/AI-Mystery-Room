# AI MYSTERY ROOM
## Master Specification Sheet — Single Source of Truth (SSOT)

**Document type:** Product Requirements + Technical Design + Implementation Specification  
**Project name:** AI Mystery Room  
**Version:** 1.0  
**Status:** Development-ready specification  
**Primary audience:** OpenAI Codex, developers, testers, and project maintainers  
**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI provider:** Google Gemini  
**Architecture:** MERN stack with modular AI services

---

# 1. PROJECT OVERVIEW

## 1.1 Product Vision

AI Mystery Room is an interactive, AI-powered detective game in which users become investigators and solve fictional mysteries using AI-generated stories, suspects, evidence, and clues.

The user provides a short scenario, story idea, or mystery theme. The application transforms that input into a complete fictional investigation containing a crime or unexplained incident, a cast of suspects, evidence, misleading clues, a hidden culprit, and a final solution.

Users examine the evidence, develop theories, and select the person they believe is responsible. The application evaluates their answer against the predetermined solution and provides a final explanation.

**Product tagline:** Enter the mystery. Follow the evidence. Uncover the truth.

## 1.2 Problem Statement

Traditional mystery games often rely on fixed storylines, limited replayability, and predetermined content. AI Mystery Room aims to create personalized investigations from user-provided ideas, offering a different mystery experience for each playthrough while maintaining logical consistency.

## 1.3 Core Objectives

1. Allow users to create mysteries from their own scenarios.
2. Generate original fictional investigations using Gemini.
3. Create multiple suspects with believable motives, backgrounds, and alibis.
4. Present evidence through interactive investigation interfaces.
5. Support fictional WhatsApp-style conversations, images, CCTV-style recordings, documents, and other clues.
6. Include reliable clues, misleading evidence, contradictions, and red herrings.
7. Store a hidden, immutable solution for each investigation.
8. Let users submit a culprit selection and receive a justified verdict.
9. Provide a polished, responsive, immersive detective experience.
10. Maintain clear separation between the frontend, backend, database, and AI generation services.

## 1.4 Target Users

- Mystery and detective-story enthusiasts.
- Casual gamers who enjoy solving puzzles.
- Students interested in logical reasoning and investigative thinking.
- Users who want to create and play personalized fictional scenarios.

## 1.5 Product Principles

- **Consistency over randomness:** Evidence must support the intended solution.
- **Investigation over guessing:** Users should be able to solve mysteries using available clues.
- **AI-assisted, application-controlled:** The AI proposes content; the backend validates and controls game state.
- **Fiction first:** All generated suspects, messages, incidents, and media must be presented as fictional.
- **Progressive disclosure:** Reveal the solution only after the player submits a verdict or explicitly requests an allowed reveal.
- **Maintainability:** New mystery types and evidence formats must be addable without rewriting the core game.

---

# 2. PRODUCT SCOPE

## 2.1 MVP Features — Mandatory

The first working version must include:

- Landing page.
- Mystery creation form.
- Scenario text input.
- Genre and difficulty selection.
- Gemini-powered mystery generation.
- Suspect profiles.
- Investigation dashboard.
- Evidence room.
- Fictional chat transcripts.
- Image-based evidence with captions and provenance.
- CCTV-style evidence presented through a real video asset or a clearly labeled simulated recording.
- Timeline of events.
- Evidence inspection and clue tracking.
- Culprit selection.
- Verdict evaluation.
- Explanation of the correct solution.
- Investigation progress tracking.
- MongoDB persistence.
- Loading, error, retry, and empty states.
- Responsive desktop and mobile interfaces.
- Basic session management and API security.

## 2.2 Post-MVP Features

Design the architecture so the following can be added later without requiring a complete rewrite:

- User registration and login.
- Personal investigation history.
- Saved mysteries and bookmarks.
- Multiple endings.
- Hint system with limited hints.
- Scoring, badges, and achievements.
- Leaderboards.
- Shareable mystery links.
- Public mystery library.
- AI-generated audio recordings.
- Actual AI-generated video clips.
- Multiplayer investigations.
- Customizable detective avatars.
- Admin moderation dashboard.
- Paid plans and usage limits.

Do not implement post-MVP features unless explicitly requested. Do not let optional features delay the core playable experience.

---

# 3. END-TO-END USER JOURNEY

## Step 1: Landing Page

The user visits the website and sees a cinematic introduction explaining the game.

Primary call to action: **Create a Mystery**

Secondary action: **Explore How It Works**

## Step 2: Mystery Configuration

The user provides:

- Scenario or story premise.
- Mystery category.
- Difficulty level.
- Optional setting.
- Optional preferred number of suspects.
- Optional tone.

Example scenario:

"A software engineer is found unconscious inside a locked office after a product launch. Three colleagues had access to the building, and a confidential file has disappeared."

Example configuration:

- Genre: Crime / Suspense.
- Difficulty: Medium.
- Suspects: 4.
- Setting: Modern technology company.
- Tone: Realistic thriller.

The form must validate required fields and enforce configurable input limits.

## Step 3: AI Mystery Generation

The frontend submits the configuration to the backend.

The backend:

1. Validates the input.
2. Checks applicable generation limits.
3. Creates a mystery-generation job.
4. Calls Gemini through a dedicated AI service.
5. Parses the structured response.
6. Validates the mystery schema and logical constraints.
7. Checks evidence consistency.
8. Retries or repairs invalid output within a bounded limit.
9. Persists the accepted mystery and its hidden solution.
10. Returns the generated investigation to the frontend.

The user sees generation progress and a useful error if generation fails.

Do not expose the Gemini API key or hidden solution to the browser.

## Step 4: Investigation Briefing

Present the case introduction, incident details, victim information if applicable, suspects, location, and initial timeline.

The user should understand the objective without being shown the culprit.

## Step 5: Explore the Evidence Room

Users can open evidence items, read conversations, inspect images, examine documents, and review recorded events.

Each evidence item must have:

- A title.
- An evidence type.
- A short summary.
- Detailed content or a media reference.
- A discovery source.
- A timestamp or event time when relevant.
- A clue classification.
- An optional list of related suspects.
- A clear inspection interface.

Evidence must be navigable without requiring users to guess which UI elements are clickable.

## Step 6: Build a Theory

Users can:

- Review all suspects.
- Compare alibis.
- Examine contradictions.
- Connect evidence to suspects.
- Mark evidence as important.
- Review the timeline.
- Optionally record a private theory or notes.

For the MVP, notes and evidence bookmarking are optional; evidence inspection and timeline access are mandatory.

## Step 7: Submit a Verdict

The user chooses one suspect as the culprit and confirms the selection.

Before final submission, display a confirmation dialog.

The verdict is checked against the stored canonical culprit ID.

## Step 8: Reveal the Solution

Display:

- Correct or incorrect verdict.
- Culprit identity.
- Motive.
- Method and opportunity.
- Timeline reconstruction.
- Key evidence supporting the conclusion.
- Explanation of misleading clues.
- Explanation of contradictions.
- Final case resolution.

The explanation must be grounded in the original generated case, not generated from scratch without reference to it.

## Step 9: Results and Replay

Allow users to:

- Review the evidence again.
- Return to the case summary.
- Start a new mystery.
- Optionally retry the case if the selected game mode permits it.

---

# 4. FUNCTIONAL REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | User can enter a custom mystery premise | P0 |
| FR-002 | User can select genre and difficulty | P0 |
| FR-003 | Backend generates a complete mystery through Gemini | P0 |
| FR-004 | Every mystery contains a predetermined culprit | P0 |
| FR-005 | The mystery contains multiple distinguishable suspects | P0 |
| FR-006 | Every suspect has a believable background and alibi | P0 |
| FR-007 | Evidence supports the solution and includes meaningful clues | P0 |
| FR-008 | User can inspect evidence in an interactive interface | P0 |
| FR-009 | User can view a chronological timeline | P0 |
| FR-010 | User can submit a culprit selection | P0 |
| FR-011 | Verdict is evaluated against the canonical culprit ID | P0 |
| FR-012 | Solution and supporting reasoning are revealed after verdict | P0 |
| FR-013 | Mystery data persists in MongoDB | P0 |
| FR-014 | Backend handles malformed AI responses safely | P0 |
| FR-015 | Application supports mobile and desktop screens | P0 |
| FR-016 | AI-generated or simulated media is labeled accurately | P0 |
| FR-017 | Loading, failure, and retry states are implemented | P0 |
| FR-018 | User can mark evidence as important | P1 |
| FR-019 | User can maintain investigation notes | P1 |
| FR-020 | User can browse personal case history | P2 |

P0 requirements must be completed before the application is considered MVP-ready.

---

# 5. GAME DESIGN AND MYSTERY LOGIC

## 5.1 Mystery Structure

Each investigation must contain:

1. Case introduction.
2. Incident description.
3. Incident location and relevant setting.
4. Victim or affected party, when appropriate.
5. A cast of suspects.
6. A predetermined culprit.
7. Motive, means, and opportunity.
8. A consistent event timeline.
9. Multiple evidence items.
10. At least one meaningful contradiction or deduction opportunity.
11. One or more plausible red herrings.
12. A canonical solution.
13. A complete explanation of the solution.

The MVP should normally generate 3–5 suspects, with four as the default.

The number of evidence items should depend on the selected difficulty. Use these starting targets:

- Easy: 5–7 evidence items.
- Medium: 8–12 evidence items.
- Hard: 12–16 evidence items.

These are product defaults, not hard limits.

## 5.2 Difficulty Rules

**Easy**

- 3 suspects by default.
- Strong direct clues.
- Few red herrings.
- A relatively simple timeline.
- The culprit can be identified using a small number of clues.

**Medium**

- 4 suspects by default.
- Several related clues.
- At least one contradiction.
- Plausible alternative theories.
- Red herrings that can be disproved.

**Hard**

- 4–5 suspects.
- Multiple interacting clues.
- More subtle contradictions.
- Greater reliance on chronology and cross-referencing.
- Red herrings that require additional evidence to eliminate.

Difficulty must affect actual reasoning complexity, not merely the labels or quantity of evidence.

## 5.3 Canonical Culprit

The canonical culprit is chosen before the mystery becomes playable.

The backend stores the culprit's internal ID in the protected solution record.

Rules:

- Every suspect has a unique ID.
- The culprit ID must match exactly one suspect.
- The verdict endpoint must compare IDs, not names.
- The canonical solution cannot change after publication.
- Regenerating or repairing evidence must not silently change the culprit.
- Once a mystery is playable, the story and solution must be immutable unless a deliberate administrative versioning feature is introduced.

## 5.4 Evidence Consistency Rules

Every clue must be consistent with the canonical timeline and solution.

For each important clue, the generator must specify:

- What the user sees.
- What the clue actually means.
- Which suspect or suspects it concerns.
- Whether it is direct evidence, circumstantial evidence, a red herring, or contextual information.
- How it affects the case.
- How the final explanation interprets it.

A red herring may initially implicate an innocent suspect, but the complete case must contain a fair way to challenge or disprove that implication.

The solution must not depend on information that is absent from the evidence room.

No suspect should become the culprit solely because the final explanation introduces an undisclosed fact.

## 5.5 Evidence Types

The MVP must support the following types.

**Chat Transcript**

A fictional WhatsApp-style conversation with:

- Participants.
- Message text.
- Message timestamps.
- Optional edited/deleted indicators.
- Optional attachment references.
- A clearly fictional presentation.

**Image Evidence**

A generated or selected image with:

- Image asset URL or storage key.
- Caption.
- Claimed discovery source.
- Relevant event time, if known.
- Visual description.
- Associated clue metadata.

**CCTV Evidence**

A recorded-event interface containing:

- Camera name or ID.
- Location.
- Recording timestamp.
- Event summary.
- A playable video asset when available.
- Alternatively, a clearly labeled simulated recording with timestamped still frames or a storyboard.

Never present a still image or a text summary as if it were an actual video recording.

**Document Evidence**

Examples include fictional reports, notes, access logs, receipts, emails, and incident records.

**Timeline Evidence**

A structured set of events used to compare suspect alibis with known events.

**Witness Statement**

A fictional statement that may contain reliable information, incomplete recollection, or intentional deception, as defined by the case.

## 5.6 Verdict and Scoring

The MVP uses deterministic verdict evaluation.

- Correct selection: display a successful resolution.
- Incorrect selection: explain that the selected suspect does not match the canonical solution.
- Reveal the correct culprit and reasoning after the submitted verdict.
- Prevent duplicate final submissions unless retry mode explicitly permits them.

Optional score calculation:

- Correct culprit: 60 points.
- Important evidence discovered: up to 25 points.
- Correct deduction or contradiction identified: up to 15 points.

Total: 100 points.

This scoring system is optional for the MVP. If implemented, its calculations must be deterministic and server-authoritative.

---

# 6. UI/UX SPECIFICATION

## 6.1 Visual Direction

The website should feel like a premium detective investigation platform rather than a generic AI chatbot.

Design keywords:

- Cinematic.
- Mysterious.
- Premium.
- Immersive.
- Editorial.
- Modern.
- Evidence-driven.
- Responsive.

### Color System

Use a dark investigation-room theme as the default.

| Token | Suggested value | Purpose |
|---|---|---|
| Background | `#0B0D12` | Main page background |
| Surface | `#141923` | Cards and panels |
| Elevated surface | `#1C2430` | Modals and active panels |
| Primary accent | `#C7A86A` | Highlights and primary actions |
| Text primary | `#F3F4F6` | Main text |
| Text secondary | `#9CA3AF` | Supporting text |
| Success | `#4ADE80` | Correct verdict and success states |
| Warning | `#FBBF24` | Warnings and uncertain clues |
| Error | `#F87171` | Errors and failed actions |
| Border | `#303744` | Dividers and card boundaries |

These values are initial design tokens and may be refined during implementation without changing functional behavior.

## 6.2 Typography

Use a readable sans-serif typeface for navigation, body text, controls, and evidence details.

A distinctive serif display typeface may be used for major case titles and dramatic headings.

Typography must prioritize readability, particularly for long chat transcripts, documents, and timelines.

## 6.3 Required Pages

### Page A: Landing Page

Components:

- Navbar with logo and navigation.
- Hero headline.
- Supporting description.
- Primary “Create a Mystery” CTA.
- Secondary explanation CTA.
- Example mystery preview.
- Feature cards.
- Three-step “How It Works” section.
- Example evidence preview.
- Footer.

The page should communicate the product immediately, without requiring users to scroll to discover the primary action.

### Page B: Create Mystery

Components:

- Scenario textarea.
- Genre selector.
- Difficulty selector.
- Suspect-count selector.
- Optional setting field.
- Optional tone selector.
- Input validation.
- Estimated generation status or cost messaging where appropriate.
- Generate Mystery button.
- Example prompt and reset action.

The form must preserve entered text if a generation request fails.

### Page C: Generation Screen

Display meaningful progress states, for example:

1. Designing the case.
2. Creating suspects.
3. Constructing the evidence.
4. Checking consistency.
5. Preparing the investigation.

These should reflect actual backend job states where possible. Do not pretend an operation is complete simply because an animation has advanced.

Include retry and return actions on failure.

### Page D: Investigation Dashboard

Suggested layout:

- Left sidebar: case navigation.
- Main panel: case overview and selected content.
- Right panel: case facts, selected suspect, or investigation tools where screen width permits.

Required sections:

- Case briefing.
- Suspects.
- Evidence room.
- Timeline.
- Verdict submission.

On smaller screens, convert side panels into tabs, drawers, or stacked sections.

### Page E: Suspect Profile

Display:

- Fictional portrait, when available.
- Name and role.
- Background.
- Known relationships.
- Motive information available to the player.
- Alibi.
- Relevant evidence links.
- Information revealed through investigation.

The player-facing profile must never expose the canonical culprit flag, private solution, or internal AI reasoning.

### Page F: Evidence Viewer

Provide a dedicated inspection interface with:

- Evidence title and type.
- Main content or media.
- Metadata and timestamps.
- Associated suspects.
- Evidence description.
- Mark-important action.
- Previous/next navigation.
- Return-to-investigation action.

The evidence viewer must handle missing or failed media gracefully.

### Page G: Timeline

Present chronological events using a readable vertical timeline or another clear timeline layout.

Each event may link to its related evidence or suspect.

Distinguish confirmed events from claims made by suspects when that distinction is known.

### Page H: Verdict Screen

Display suspect selection cards and a submit button.

Require explicit confirmation before final submission.

After submission, show the result and a complete solution explanation.

### Page I: Error and Empty States

Design reusable states for:

- No investigations.
- Generation in progress.
- Generation failed.
- Evidence unavailable.
- Network error.
- Invalid mystery.
- Mystery not found.
- Verdict already submitted.
- Expired or invalid session.

## 6.4 Interaction and Animation

Use Framer Motion or a comparable React animation library if it is compatible with the selected setup.

Recommended effects:

- Smooth page transitions.
- Subtle card entrance animations.
- Evidence drawer transitions.
- Timeline reveal animations.
- Hover states.
- Small loading indicators.
- A restrained verdict reveal.

Avoid excessive motion, long delays, and animations that prevent interaction.

Respect reduced-motion preferences.

## 6.5 Accessibility

- Use semantic HTML.
- Label every form field.
- Support keyboard navigation.
- Maintain visible focus indicators.
- Provide sufficient contrast.
- Add meaningful alternative text to relevant images.
- Use accessible dialogs.
- Do not rely on color alone to communicate evidence classifications or verdicts.

---

# 7. TECHNICAL ARCHITECTURE

## 7.1 Architecture Overview

Use a modular MERN architecture.

```text
React Frontend
      |
      | HTTPS / JSON
      v
Node.js + Express API
      |
      +---- Authentication / Session Layer
      |
      +---- Mystery Service
      |
      +---- Evidence Service
      |
      +---- Verdict Service
      |
      +---- Gemini AI Service
      |
      +---- Media Generation / Storage Adapter
      |
      v
MongoDB

Gemini API <---- Backend AI Service

Object Storage <---- Media Adapter
```

The browser communicates only with the backend API.

All Gemini requests, secret keys, solution checks, and trusted persistence operations occur on the backend.

## 7.2 Frontend Requirements

Recommended libraries:

- React.
- Vite.
- React Router.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- Axios or a centralized Fetch-based API client.

Use TypeScript for new frontend code if the repository does not already establish a different convention. If an existing JavaScript project is already in place, continue its established language unless migration is explicitly approved.

Organize the frontend into reusable components, pages, hooks, services, and types.

## 7.3 Backend Requirements

Recommended dependencies:

- Node.js.
- Express.
- Mongoose.
- Official Google GenAI SDK compatible with the selected Gemini API.
- Zod or an equivalent schema-validation library.
- dotenv or the runtime's environment configuration mechanism.
- Helmet.
- CORS middleware with an explicit origin allowlist.
- Rate-limiting middleware.
- A request-validation and error-handling layer.
- A logging library appropriate to the deployment environment.

Use a supported Node.js LTS version and compatible dependency versions. Check the existing repository before selecting or upgrading packages.

## 7.4 Database

MongoDB is the primary persistence layer.

Mongoose schemas should enforce:

- Required fields.
- Type constraints.
- Enumerated values.
- Uniqueness where necessary.
- Appropriate references.
- Creation and update timestamps.
- Database indexes for frequently queried fields.

Never store the Gemini API key, private credentials, or unnecessary personal information in mystery documents.

## 7.5 Asynchronous Generation

Mystery generation and media creation may take longer than an ordinary HTTP request.

The implementation should use a generation-job abstraction.

For the MVP, a database-backed job status and bounded polling are acceptable for a single-server deployment. If generation volume grows, move to a durable queue and worker architecture.

Do not rely on a long-lived browser request as the only record of a generation job.

Suggested states:

`queued → generating → validating → ready`

Terminal alternatives:

`failed`, `cancelled`

Every transition must be controlled by the backend.

---

# 8. SUGGESTED REPOSITORY STRUCTURE

Codex must inspect the current repository before creating or moving files. Preserve working code and established conventions where possible.

A clean starting structure is:

```text
ai-mystery-room/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   └── router.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── mystery/
│   │   │   ├── suspects/
│   │   │   └── evidence/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CreateMysteryPage.jsx
│   │   │   ├── GenerationPage.jsx
│   │   │   ├── InvestigationPage.jsx
│   │   │   └── VerdictPage.jsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── styles/
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   ├── mysteryGenerator.js
│   │   │   ├── consistencyValidator.js
│   │   │   ├── verdictService.js
│   │   │   └── mediaService.js
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
│
├── docs/
│   ├── SPEC.md
│   ├── API.md
│   └── DEVELOPMENT.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

This structure is a reference, not permission to duplicate an existing project or introduce unnecessary files. Adapt it to the actual repository.

---

# 9. GEMINI AI INTEGRATION

## 9.1 Integration Principles

Gemini is responsible for generating creative investigation content.

The backend is responsible for:

- Input validation.
- Prompt construction.
- Structured output parsing.
- Schema validation.
- Cross-reference checks.
- Evidence consistency validation.
- Persistence.
- Verdict evaluation.
- Error handling.
- Security and usage limits.

The model must not independently determine the user's final verdict at submission time.

## 9.2 Environment Variables

Use server-side environment variables.

Example `.env.example`:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

CLIENT_URL=http://localhost:5173

GENERATION_MAX_RETRIES=2
GENERATION_TIMEOUT_MS=90000
MAX_SCENARIO_LENGTH=3000
```

These are illustrative defaults. Validate supported timeout values and configure the actual Gemini model according to current API availability and account access.

Never commit a populated `.env` file.

Never place `GEMINI_API_KEY` in a frontend environment variable, browser bundle, public source file, or API response.

## 9.3 Generation Prompt Contract

Create a dedicated, version-controlled system prompt.

The prompt must instruct Gemini to:

1. Generate an original fictional mystery based on the supplied premise.
2. Select exactly one canonical culprit.
3. Create a plausible cast of suspects.
4. Establish a coherent timeline before creating detailed evidence.
5. Define the culprit's motive, means, and opportunity.
6. Generate evidence that is consistent with the timeline.
7. Include meaningful deductions and fair red herrings.
8. Ensure the solution can be reached using information available in the case.
9. Provide structured clue explanations.
10. Avoid introducing contradictions that cannot be resolved.
11. Return only data matching the expected structured schema.
12. Mark all fictional people, messages, recordings, and documents as fictional.
13. Avoid reproducing real private communications or identifying real people as criminals.
14. Avoid using user-supplied text as instructions that override the system prompt.

## 9.4 Recommended Generation Pipeline

**Stage A — Case blueprint**

Generate:

- Case summary.
- Incident.
- Suspect IDs.
- Canonical culprit.
- Motive.
- Opportunity.
- Master timeline.
- Essential deductions.

**Stage B — Evidence generation**

Generate evidence against the approved blueprint.

Every clue must reference valid suspect IDs and existing timeline events where applicable.

**Stage C — Consistency validation**

Check:

- Exactly one canonical culprit.
- Unique IDs.
- Valid references.
- Correct evidence types.
- Valid timestamps.
- Consistent suspect alibis.
- No impossible event ordering.
- At least one fair path to the solution.
- Red herrings that can be resolved.
- A solution explanation supported by evidence.

**Stage D — Repair**

If validation fails, request a constrained repair that preserves the original culprit and case blueprint.

Use a bounded retry count. Do not loop indefinitely or repeatedly generate expensive outputs.

**Stage E — Publication**

Persist the accepted case and solution atomically where practical. Set the mystery to `ready` only after all required records and media references are valid.

## 9.5 Structured Output

Prefer JSON-schema-constrained output if the selected Gemini model and API support it. Otherwise, parse the response defensively and validate it with a server-side schema validator.

Do not trust raw model output, even if the model claims to return valid JSON.

Example generation contract:

```json
{
  "title": "The Midnight Archive",
  "genre": "crime",
  "difficulty": "medium",
  "caseBrief": "A fictional case introduction.",
  "incident": {
    "description": "A confidential archive has disappeared.",
    "location": "A fictional office",
    "incidentTime": "2026-10-24T21:30:00Z"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Maya Reed",
      "role": "Archivist",
      "background": "Fictional background.",
      "motive": "Potential motive.",
      "alibi": "Claimed alibi."
    }
  ],
  "timeline": [
    {
      "id": "event_1",
      "timestamp": "2026-10-24T20:45:00Z",
      "description": "A fictional event.",
      "relatedSuspectIds": ["suspect_1"],
      "relatedEvidenceIds": ["evidence_1"]
    }
  ],
  "evidence": [
    {
      "id": "evidence_1",
      "type": "chat",
      "title": "Recovered Messages",
      "summary": "A conversation about the archive.",
      "content": {},
      "relatedSuspectIds": ["suspect_1"],
      "timelineEventIds": ["event_1"],
      "clueType": "circumstantial",
      "importance": "high",
      "fictional": true
    }
  ],
  "solution": {
    "culpritId": "suspect_1",
    "motive": "Canonical motive.",
    "method": "How the fictional incident occurred.",
    "opportunity": "Why the culprit had the opportunity.",
    "timelineExplanation": "How the events fit together.",
    "evidenceReasoning": [
      {
        "evidenceId": "evidence_1",
        "explanation": "How the evidence supports or challenges the solution."
      }
    ],
    "redHerringExplanation": "Why misleading clues appeared plausible."
  }
}
```

This is an illustrative shape, not a complete production schema. The real schema must define all required fields, allowed enum values, maximum lengths, evidence-specific content structures, and validation rules.

Use stable IDs rather than suspect names for internal references.

## 9.6 AI Failure Handling

Handle these situations explicitly:

- Gemini API unavailable.
- Rate limit exceeded.
- Invalid API key.
- Request timeout.
- Model response truncated.
- Invalid JSON.
- Schema validation failure.
- Inconsistent evidence.
- Media generation failure.
- Token or quota exhaustion.

Show a friendly frontend error without exposing provider diagnostics.

Log safe diagnostic information on the server. Never log API keys, authorization headers, or full hidden solutions unnecessarily.

---

# 10. AI-GENERATED MEDIA STRATEGY

## 10.1 Media Architecture

Media generation must be abstracted behind a `mediaService` so that the project is not tied to a capability that the selected model may not provide.

Use separate adapters for:

- Text generation.
- Image generation.
- Video generation or video asset retrieval.
- Optional audio generation.

The selected Gemini model and account must be checked for the required capabilities before enabling an adapter.

Do not assume that text generation, image generation, and video generation are all supported by the same model or API endpoint.

## 10.2 MVP Media Fallbacks

The game must remain playable even if advanced media generation is unavailable.

| Evidence type | Preferred implementation | Fallback |
|---|---|---|
| WhatsApp-style chat | Generate structured fictional messages | Render text messages in a custom chat UI |
| Suspect portrait | AI-generated fictional portrait | Designed avatar or illustrated placeholder |
| Crime-scene image | Generated image through a supported image service | Clearly labeled illustrative image |
| CCTV recording | Supported generated video asset | Timestamped simulated frames and event log |
| Document | AI-generated structured content | HTML/CSS document viewer |
| Audio recording | Supported generated audio | Fictional transcript labeled as a transcript |

Never imply that a fallback is a real recording or a genuine photograph.

## 10.3 Asset Handling

Use object storage or an equivalent media-storage adapter for production.

Store metadata in MongoDB and keep large media files outside MongoDB unless a deliberate design decision justifies otherwise.

Every asset should have:

- Unique ID.
- Storage key or URL.
- Media type.
- MIME type.
- Generation status.
- Associated mystery ID.
- Associated evidence ID.
- Fictional-content marker.
- Creation timestamp.
- Optional prompt version or generation metadata.

Validate file types, file sizes, and upload permissions. Do not trust user-provided URLs or file metadata.

---

# 11. DATABASE DESIGN

## 11.1 Mystery Collection

Suggested fields:

```text
Mystery
├── _id
├── title
├── premise
├── genre
├── difficulty
├── caseBrief
├── incident
├── suspects[]
├── timeline[]
├── evidence[]
├── solution (protected)
├── generationStatus
├── schemaVersion
├── promptVersion
├── createdAt
└── updatedAt
```

## 11.2 Suspect Schema

```text
Suspect
├── id
├── name
├── role
├── background
├── motive
├── alibi
├── portraitAssetId (optional)
└── publicFacts[]
```

Keep public suspect information separate from private solution information.

The public API must never serialize the canonical culprit flag or protected solution object.

## 11.3 Evidence Schema

```text
Evidence
├── id
├── type
├── title
├── summary
├── content
├── assetIds[]
├── relatedSuspectIds[]
├── timelineEventIds[]
├── clueType
├── importance
├── sourceDescription
├── eventTimestamp (optional)
└── fictional
```

Use discriminated schemas or equivalent validation for each evidence type.

For example, chat evidence requires messages and participants; CCTV evidence requires recording metadata and an asset or simulated-event representation.

## 11.4 Solution Schema

```text
Solution
├── culpritId
├── motive
├── method
├── opportunity
├── timelineExplanation
├── evidenceReasoning[]
└── redHerringExplanation
```

The solution belongs to the protected server-side mystery record or a separate private collection. Do not include it in public case retrieval responses.

## 11.5 Investigation Session

```text
InvestigationSession
├── _id
├── mysteryId
├── ownerId (optional)
├── sessionTokenHash
├── discoveredEvidenceIds[]
├── bookmarkedEvidenceIds[]
├── notes (optional)
├── verdict
├── verdictSubmittedAt
├── status
├── createdAt
└── updatedAt
```

For an anonymous MVP, use an opaque, high-entropy session token. Store only its hash where practical.

Avoid accepting arbitrary session IDs as sufficient authorization. Verify session ownership for every session-specific operation.

## 11.6 Generation Job

```text
GenerationJob
├── _id
├── status
├── input
├── mysteryId (optional)
├── progressStage
├── errorCode (optional)
├── retryCount
├── createdAt
└── updatedAt
```

Do not store API secrets or unnecessary sensitive input in job records.

---

# 12. API SPECIFICATION

Base URL:

`/api/v1`

All responses use JSON unless an endpoint explicitly serves media.

## 12.1 Health Check

`GET /api/v1/health`

Purpose: Confirm that the API process is running.

Example:

```json
{
  "status": "ok"
}
```

Do not expose secrets, internal stack traces, or detailed infrastructure information in the public health response.

## 12.2 Create Mystery

`POST /api/v1/mysteries`

Request:

```json
{
  "premise": "A confidential file disappears from a locked office.",
  "genre": "crime",
  "difficulty": "medium",
  "suspectCount": 4,
  "setting": "A technology company",
  "tone": "suspenseful"
}
```

Validation:

- Premise is required.
- Premise length must respect server configuration.
- Genre and difficulty must be valid enum values.
- Suspect count must be within the allowed range.
- Optional fields must be bounded and sanitized.
- Generation limits must be enforced.

Response: `202 Accepted`

```json
{
  "jobId": "job_example",
  "status": "queued",
  "statusUrl": "/api/v1/generation-jobs/job_example"
}
```

The backend should create the job before attempting generation so that the client can recover its status.

## 12.3 Check Generation Status

`GET /api/v1/generation-jobs/:jobId`

Example:

```json
{
  "jobId": "job_example",
  "status": "generating",
  "progressStage": "creating_evidence",
  "mysteryId": null
}
```

When generation succeeds, return the mystery ID and mark the job as ready.

Do not return the solution as part of this endpoint.

## 12.4 Retrieve Mystery

`GET /api/v1/mysteries/:mysteryId`

Returns the public case briefing, suspects, timeline, and evidence metadata needed by the player.

Must exclude:

- Canonical culprit ID.
- Protected solution.
- Internal model prompts.
- Private AI reasoning.
- Server-only generation diagnostics.
- Internal authorization data.

## 12.5 Start Investigation Session

`POST /api/v1/mysteries/:mysteryId/sessions`

Creates a session for the mystery.

Return a session identifier and an opaque session credential, or use an established secure cookie-based mechanism.

Do not expose other users' sessions.

## 12.6 Retrieve Evidence

`GET /api/v1/sessions/:sessionId/evidence/:evidenceId`

Returns one evidence item after verifying that the session can access it.

## 12.7 Update Investigation Progress

`PATCH /api/v1/sessions/:sessionId/progress`

Example:

```json
{
  "discoveredEvidenceIds": ["evidence_1"],
  "bookmarkedEvidenceIds": ["evidence_1"]
}
```

The backend must validate all referenced IDs against the mystery and session.

Do not accept arbitrary fields or overwrite protected solution information.

## 12.8 Submit Verdict

`POST /api/v1/sessions/:sessionId/verdict`

Request:

```json
{
  "culpritId": "suspect_2"
}
```

The server:

1. Authenticates or validates session ownership.
2. Confirms the session is active.
3. Confirms the suspect exists in that mystery.
4. Loads the canonical solution from protected storage.
5. Compares the selected suspect ID with the canonical culprit ID.
6. Persists the verdict.
7. Returns the allowed result and solution explanation.

Example response:

```json
{
  "correct": false,
  "selectedSuspectId": "suspect_2",
  "solution": {
    "culpritId": "suspect_1",
    "motive": "Fictional motive.",
    "method": "Fictional method.",
    "timelineExplanation": "The events establish the culprit's opportunity.",
    "evidenceReasoning": [],
    "redHerringExplanation": "The misleading clue is explained by the evidence."
  }
}
```

This response is appropriate only after the verdict has been submitted and the solution reveal is authorized.

## 12.9 Error Format

Use a consistent error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid mystery premise."
  }
}
```

Do not return stack traces or provider credentials to clients.

## 12.10 HTTP Status Codes

- `200`: Successful retrieval or update.
- `201`: Resource created synchronously.
- `202`: Asynchronous job accepted.
- `400`: Invalid request.
- `401`: Missing or invalid authentication where required.
- `403`: Access denied.
- `404`: Resource not found.
- `409`: Invalid state transition or duplicate final submission.
- `413`: Request too large.
- `422`: Semantically invalid input.
- `429`: Rate limit exceeded.
- `500`: Unexpected server error.
- `502` or `503`: Upstream AI service or dependency unavailable, where appropriate.

---

# 13. SECURITY AND PRIVACY

Security is part of the core implementation, not a later enhancement.

## 13.1 API Security

- Store API keys only on the server.
- Validate request bodies and route parameters.
- Apply request-size limits.
- Configure CORS with explicit allowed origins.
- Use Helmet or equivalent security headers.
- Apply rate limits to generation and verdict endpoints.
- Use request timeouts and bounded AI retries.
- Avoid unsafe dynamic code execution.
- Prevent MongoDB query injection by validating inputs and avoiding unsafe query construction.
- Use secure session credentials.
- Never trust frontend-provided verdict results.

## 13.2 Prompt Injection

Treat the user's premise as untrusted data.

The backend must use a fixed system prompt and clearly delimit the user premise as content rather than instructions.

Do not allow a premise to override output requirements, reveal hidden solutions, alter application rules, or instruct the model to generate malicious code.

## 13.3 Solution Protection

- Do not send the canonical culprit ID to the browser before verdict submission.
- Do not place solution data in HTML, client state, public metadata, or downloadable client-side JSON.
- Do not include protected fields in ordinary database serializers.
- Keep verdict evaluation on the backend.
- Avoid revealing solution details in public logs or error responses.
- Add tests verifying that public endpoints do not leak solution data.

## 13.4 Fictional Content and Media

All generated cases are fictional.

The UI must clearly indicate that chats, images, documents, recordings, and people are fictional or simulated.

Do not fabricate real evidence about actual people or present AI-generated media as authentic CCTV, real WhatsApp exports, or genuine investigative records.

## 13.5 Resource Protection

- Limit scenario length.
- Limit generation concurrency.
- Limit retries.
- Apply request quotas.
- Bound media file size.
- Use asset access controls.
- Prevent unbounded polling.
- Provide cancellation or timeout behavior where supported.

---

# 14. PERFORMANCE AND RELIABILITY

Initial engineering targets:

- Landing page should feel responsive on ordinary broadband.
- Ordinary API operations should generally complete within 500 ms at the application layer, excluding network latency and external dependencies.
- Mystery generation may take tens of seconds and must use asynchronous job status.
- Evidence navigation should not require regenerating the case.
- The case should remain playable if optional media generation fails.
- All AI operations must have timeouts and bounded retries.
- Use pagination for large collections where needed.
- Avoid unnecessary repeated AI requests when navigating between pages.
- Cache safe, immutable public mystery data where appropriate, but never cache private session information across users.

These are initial targets to measure during testing, not guaranteed service-level commitments.

---

# 15. TESTING REQUIREMENTS

## 15.1 Unit Tests

Test:

- Request validation.
- Mystery schema validation.
- Unique ID validation.
- Timeline consistency rules.
- Suspect reference integrity.
- Evidence reference integrity.
- Canonical culprit validation.
- Verdict calculation.
- Session authorization.
- Public/private serialization.
- Error normalization.

## 15.2 Integration Tests

Test:

- MongoDB connection and persistence.
- Mystery creation endpoint.
- Generation job transitions.
- Gemini service success and failure handling.
- Invalid JSON from the AI provider.
- Consistency repair behavior.
- Evidence retrieval.
- Session creation and progress updates.
- Verdict submission.
- Solution reveal authorization.
- CORS and rate-limit behavior.

Use mocked Gemini responses in ordinary automated tests to avoid unnecessary API costs and nondeterministic failures.

## 15.3 End-to-End Tests

The primary end-to-end test must cover:

1. Open the landing page.
2. Navigate to mystery creation.
3. Enter a valid scenario.
4. Select difficulty and genre.
5. Start generation.
6. Wait for generation to finish.
7. Open the case briefing.
8. Inspect multiple suspects.
9. Open different evidence types.
10. Review the timeline.
11. Select a culprit.
12. Submit the verdict.
13. View the result and canonical explanation.
14. Reload the page and confirm that the case remains accessible where persistence is supported.

## 15.4 Acceptance Criteria

The MVP is complete only when all of the following pass:

- [ ] A user can create a mystery from a custom scenario.
- [ ] A mystery is generated using the backend Gemini integration.
- [ ] The mystery includes suspects, evidence, timeline, and solution.
- [ ] The solution is logically consistent with the evidence.
- [ ] Evidence is viewable in a polished investigation interface.
- [ ] Chat evidence displays structured messages.
- [ ] Image evidence uses a valid asset or an explicitly labeled fallback.
- [ ] CCTV evidence is either a playable asset or an honestly labeled simulation.
- [ ] The culprit remains fixed after the case becomes playable.
- [ ] Public endpoints do not reveal the solution prematurely.
- [ ] Verdict evaluation is performed on the backend.
- [ ] The final explanation matches the stored solution.
- [ ] Invalid AI output does not crash the server.
- [ ] API errors are handled gracefully.
- [ ] Database persistence works.
- [ ] The website is usable on mobile and desktop.
- [ ] Secrets are absent from client bundles and source control.
- [ ] Core tests pass.
- [ ] README setup instructions work on a fresh development environment.

---

# 16. DEVELOPMENT PHASES

## Phase 1 — Repository Audit and Foundation

Tasks:

- Inspect existing files and configuration.
- Identify existing working features and dependencies.
- Set up or repair the React application.
- Set up or repair the Express server.
- Configure environment variables.
- Connect MongoDB.
- Implement the health endpoint.
- Establish shared conventions and error handling.

Deliverable: A working MERN foundation.

## Phase 2 — UI Foundation

Tasks:

- Implement the design tokens.
- Build the navbar and page layouts.
- Build the landing page.
- Build the mystery creation form.
- Build reusable buttons, cards, dialogs, and loading states.
- Implement responsive layouts.

Deliverable: A polished navigable frontend using mock case data.

## Phase 3 — Mystery Engine

Tasks:

- Define the mystery and evidence schemas.
- Implement Gemini service integration.
- Implement structured output validation.
- Implement the generation pipeline.
- Implement consistency checks and bounded retries.
- Persist generated cases.
- Implement generation-job endpoints.

Deliverable: The backend can generate and store a validated mystery.

## Phase 4 — Investigation Experience

Tasks:

- Implement case briefing.
- Implement suspect profiles.
- Implement evidence room.
- Implement chat transcript viewer.
- Implement image and CCTV evidence viewers.
- Implement the timeline.
- Connect the frontend to real API data.

Deliverable: A complete playable investigation interface.

## Phase 5 — Verdict and Solution

Tasks:

- Implement secure verdict submission.
- Compare against the canonical culprit.
- Persist the verdict.
- Implement the solution reveal.
- Add optional scoring if time permits.

Deliverable: End-to-end mystery resolution.

## Phase 6 — Media, Security, and Testing

Tasks:

- Connect available media-generation capabilities.
- Implement fallbacks.
- Add authorization and rate limiting.
- Add unit, integration, and end-to-end tests.
- Verify solution secrecy.
- Test error scenarios.
- Verify responsive behavior.

Deliverable: A stable MVP.

## Phase 7 — Deployment

Tasks:

- Configure production environment variables.
- Configure MongoDB hosting.
- Deploy the frontend and backend.
- Configure production CORS and HTTPS.
- Configure media storage if used.
- Run smoke tests.
- Document the deployment process.

Deliverable: A deployed and verified website.

**Execution rule:** Complete each phase incrementally. Do not generate the entire codebase in one enormous, unverified change.

---

# 17. ENVIRONMENT AND SETUP REQUIREMENTS

The repository must document a reliable development workflow.

Recommended root-level scripts, adapted to the existing package manager:

- `npm run dev` — start frontend and backend for local development.
- `npm run build` — build the frontend.
- `npm run test` — run the configured automated test suites.
- `npm run lint` — run configured linting checks.

If frontend and backend have separate packages, document their individual commands and provide root scripts where practical.

The README must explain:

1. Prerequisites.
2. Repository setup.
3. Dependency installation.
4. MongoDB configuration.
5. Gemini API key configuration.
6. Environment variable setup.
7. Local development startup.
8. Testing.
9. Production build.
10. Deployment.
11. Common troubleshooting steps.

Provide `.env.example` with placeholders only.

Never assume a working API key exists. The application should clearly explain missing configuration and provide an appropriate development fallback when feasible.

---

# 18. CODING STANDARDS AND IMPLEMENTATION RULES

Codex must follow these rules throughout implementation.

1. Inspect the repository before modifying it.
2. Treat this document as the product and architecture source of truth.
3. Preserve working code unless a change is necessary.
4. Prefer small, verifiable changes over large rewrites.
5. Do not create duplicate components, routes, models, or services.
6. Separate controllers, services, models, validators, and routes.
7. Keep Gemini logic in a dedicated backend service.
8. Keep verdict logic deterministic and independent of Gemini.
9. Validate all AI output before persistence.
10. Keep the canonical solution private until authorized reveal.
11. Use stable IDs for suspects, evidence, timeline events, and sessions.
12. Keep UI components reusable and accessible.
13. Centralize API error handling.
14. Avoid hardcoded secrets, URLs, and environment-specific assumptions.
15. Never silently swallow errors.
16. Never claim a feature works unless it has been implemented and tested.
17. Never use mock data as if it were production-generated data.
18. Clearly label development fixtures and media fallbacks.
19. Update tests whenever important behavior changes.
20. Update this specification when an approved product decision changes.
21. Do not install unnecessary dependencies.
22. Do not change major architecture decisions without documenting the reason.
23. Keep the app functional when optional media generation is unavailable.
24. Verify that all generated API contracts match the actual frontend implementation.
25. Report incomplete items honestly.

---

# 19. DEFINITION OF DONE

A feature is complete only when:

- Its behavior matches this specification.
- Required validation is implemented.
- Loading, error, and empty states are handled.
- Its API contract is documented when applicable.
- Relevant tests pass.
- No protected information is accidentally exposed.
- The UI works at supported screen sizes.
- Any required environment configuration is documented.
- The implementation has been verified rather than merely written.

The project is MVP-complete when the full user journey works from entering a premise to viewing the final mystery solution.

---

# 20. PROJECT DECISIONS AND ASSUMPTIONS

The following decisions govern the initial implementation:

| Decision | Initial rule |
|---|---|
| Product | AI-powered fictional detective game |
| Primary framework | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI provider | Google Gemini |
| Default genre | Crime / suspense |
| Default difficulty | Medium |
| Default suspect count | 4 |
| User accounts | Not required for the initial playable MVP |
| Case persistence | Required |
| Solution evaluation | Deterministic backend comparison |
| AI-generated text | Required |
| Generated images | Supported through an available media adapter |
| Generated video | Optional when a supported model/API is available |
| CCTV fallback | Labeled simulation or storyboard |
| Media storage | Storage adapter; external object storage preferred for production |
| Authentication | Secure anonymous sessions for the MVP; accounts can be added later |
| Scoring | Optional |
| Payments | Out of scope |
| Multiplayer | Out of scope |
| Mobile support | Required |
| Production secrets | Server-side only |

If a requirement cannot be fulfilled because of unavailable API capabilities, credentials, quota limits, or infrastructure, Codex must document the limitation and implement the closest truthful fallback without silently changing the product's core behavior.

---

# 21. MASTER INSTRUCTION FOR CODEX

Use this document as the Single Source of Truth for building AI Mystery Room.

Before coding, inspect the existing repository and identify the current architecture, dependencies, working features, missing features, and configuration issues.

Then implement the project incrementally in the order defined by the development phases.

Your highest priorities are:

1. A polished, responsive, immersive mystery-investigation interface.
2. A working MERN backend connected to MongoDB.
3. A real Gemini integration for generating structured fictional mysteries.
4. A reliable mystery engine with a predetermined culprit and consistent evidence.
5. Interactive suspect, evidence, and timeline views.
6. Secure verdict submission and a complete solution reveal.
7. Reliable persistence, error handling, and testing.

Build real functionality, not just a static design or collection of disconnected pages.

Do not expose the Gemini key, canonical solution, or private game state to the frontend. Do not pretend that unsupported media has been generated. Do not silently substitute mock AI output for real AI generation.

When working with existing code, preserve functional parts and fix the underlying issue instead of rewriting the project unnecessarily.

After each phase:

- Run the relevant checks.
- Fix errors before proceeding.
- Summarize files created or changed.
- Report tests performed and their results.
- List remaining blockers.
- Keep the project runnable.

If a minor implementation choice is unspecified, choose a conventional, maintainable solution consistent with this specification. If a major decision conflicts with the existing repository or an external technical constraint, explain the conflict and propose the smallest necessary adjustment.

**Final objective:** Deliver a complete, functional, visually polished AI Mystery Room website where users can create fictional investigations from their own stories, inspect AI-generated evidence, identify the culprit, and receive a logically consistent explanation of the case.

---

**End of Specification — AI Mystery Room SSOT v1.0**
