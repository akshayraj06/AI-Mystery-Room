import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

describe('Mystery Engine End-to-End API Lifecycle', () => {
  let app;

  beforeAll(async () => {
    await connectDB();
    app = createApp();
  }, 180000);

  afterAll(async () => {
    await disconnectDB();
  });

  let jobId;
  let mysteryId;
  let sessionId;
  let suspectIds = [];

  it('1. POST /api/v1/mysteries - creates a generation job in 202 Accepted state', async () => {
    const res = await request(app)
      .post('/api/v1/mysteries')
      .send({
        premise: 'A confidential encryption key was taken from the laboratory safe during a scheduled drill.',
        genre: 'crime',
        difficulty: 'medium',
        suspectCount: 4,
        setting: 'Apex Bio Labs',
        tone: 'realistic suspense',
      });

    expect(res.status).toBe(202);
    expect(res.body.jobId).toBeDefined();
    expect(res.body.status).toBe('queued');
    jobId = res.body.jobId;
  });

  it('2. GET /api/v1/generation-jobs/:jobId - polls job until ready', async () => {
    // Wait slightly for setImmediate job processing
    let attempts = 0;
    let jobData;
    while (attempts < 10) {
      const res = await request(app).get(`/api/v1/generation-jobs/${jobId}`);
      expect(res.status).toBe(200);
      jobData = res.body;
      if (jobData.status === 'ready') break;
      await new Promise(r => setTimeout(r, 400));
      attempts++;
    }

    expect(jobData.status).toBe('ready');
    expect(jobData.mysteryId).toBeDefined();
    mysteryId = jobData.mysteryId;
  });

  it('3. GET /api/v1/mysteries/:mysteryId - verifies solution secrecy (FR-012, Spec §13.3)', async () => {
    const res = await request(app).get(`/api/v1/mysteries/${mysteryId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBeDefined();
    expect(res.body.suspects.length).toBeGreaterThanOrEqual(3);
    expect(res.body.evidence.length).toBeGreaterThanOrEqual(5);

    // CRITICAL: Solution and canonical culpritId must NOT be exposed!
    expect(res.body.solution).toBeUndefined();
    expect(res.body.culpritId).toBeUndefined();

    suspectIds = res.body.suspects.map(s => s.id);
    expect(suspectIds.length).toBeGreaterThanOrEqual(3);
  });

  it('4. POST /api/v1/mysteries/:mysteryId/sessions - creates investigation session', async () => {
    const res = await request(app).post(`/api/v1/mysteries/${mysteryId}/sessions`);
    expect(res.status).toBe(201);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.token).toBeDefined();
    sessionId = res.body.sessionId;
  });

  it('4b. GET /api/v1/sessions/:sessionId - retrieves session state', async () => {
    const res = await request(app).get(`/api/v1/sessions/${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(sessionId);
    expect(res.body.mysteryId).toBe(mysteryId);
    expect(res.body.status).toBe('active');
  });

  it('5. GET /api/v1/sessions/:sessionId/evidence/:evidenceId - inspects evidence and tracks discovery', async () => {
    const res = await request(app).get(`/api/v1/sessions/${sessionId}/evidence/evidence_chat_1`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBeDefined();
    expect(res.body.type).toBe('chat');
    expect(res.body.content.messages).toBeDefined();
  });

  it('6. PATCH /api/v1/sessions/:sessionId/progress - bookmarks clues and saves notes', async () => {
    const res = await request(app)
      .patch(`/api/v1/sessions/${sessionId}/progress`)
      .send({
        bookmarkedEvidenceIds: ['evidence_chat_1'],
        notes: 'Notice the 21:04 timestamp contradiction in the chat log.',
      });

    expect(res.status).toBe(200);
    expect(res.body.bookmarkedEvidenceIds).toContain('evidence_chat_1');
    expect(res.body.notes).toContain('timestamp contradiction');
  });

  it('7. POST /api/v1/sessions/:sessionId/verdict - deterministic verdict evaluation reveals canonical solution', async () => {
    // Submit suspect_1
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/verdict`)
      .send({ culpritId: suspectIds[0] });

    expect(res.status).toBe(200);
    expect(typeof res.body.correct).toBe('boolean');
    expect(res.body.selectedSuspectId).toBe(suspectIds[0]);
    expect(res.body.solution).toBeDefined();
    expect(res.body.solution.culpritId).toBeDefined();
    expect(res.body.solution.motive).toBeDefined();
    expect(res.body.solution.method).toBeDefined();
    expect(res.body.solution.timelineExplanation).toBeDefined();
  });

  it('8. POST /api/v1/sessions/:sessionId/verdict - duplicate submission is rejected with 409 Conflict', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/verdict`)
      .send({ culpritId: suspectIds[0] });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});
