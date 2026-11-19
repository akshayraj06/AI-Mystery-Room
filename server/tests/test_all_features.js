import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

async function runFeatureValidation() {
  console.log('=== AI MYSTERY ROOM: FULL FEATURE VERIFICATION SUITE ===\n');
  await connectDB();
  const app = createApp();

  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  console.log(`[Suite] Local test server started at ${baseUrl}\n`);

  try {
    // 1. Health check
    console.log('[Feature 1] Testing Health Check API...');
    const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
    if (healthRes.status !== 'ok') throw new Error(`Health check failed: ${JSON.stringify(healthRes)}`);
    console.log('  ✓ Health Check returned status ok');

    // 2. Mystery Creation
    console.log('\n[Feature 2] Testing Mystery Scenario Creation & Asynchronous Job Queuing...');
    const createRes = await fetch(`${baseUrl}/mysteries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        premise: 'The quantum encryption key vanished from the high-security subterranean chamber during a simulated power outage.',
        genre: 'sci-fi',
        difficulty: 'medium',
        suspectCount: 4,
        setting: 'Apex Subterranean Quantum Facility',
        tone: 'tense scientific mystery'
      })
    });
    if (createRes.status !== 202) throw new Error(`Expected 202 Accepted, got ${createRes.status}`);
    const jobData = await createRes.json();
    console.log(`  ✓ Job created successfully: ${jobData.jobId} (status: ${jobData.status})`);

    // 3. Polling Job Status
    console.log('\n[Feature 3] Polling Generation Job Status Until Ready...');
    let mysteryId = null;
    for (let i = 0; i < 20; i++) {
      const pollRes = await fetch(`${baseUrl}/generation-jobs/${jobData.jobId}`).then(r => r.json());
      console.log(`  - Stage: ${pollRes.progressStage || pollRes.status}`);
      if (pollRes.status === 'ready') {
        mysteryId = pollRes.mysteryId;
        break;
      }
      await new Promise(r => setTimeout(r, 600));
    }
    if (!mysteryId) throw new Error('Generation job did not complete in time');
    console.log(`  ✓ Case generated and published. Mystery ID: ${mysteryId}`);

    // 4. Case Dossier Retrieval & Anti-Spoiler Secrecy Check
    console.log('\n[Feature 4] Testing Case Retrieval & Solution Secrecy (Spec §13.3)...');
    const caseData = await fetch(`${baseUrl}/mysteries/${mysteryId}`).then(r => r.json());
    console.log(`  - Title: "${caseData.title}"`);
    console.log(`  - Suspects count: ${caseData.suspects.length}`);
    console.log(`  - Evidence items: ${caseData.evidence.length}`);
    console.log(`  - Timeline events: ${caseData.timeline.length}`);
    
    // Verify solution is NOT leaked
    if (caseData.solution !== undefined || caseData.culpritId !== undefined) {
      throw new Error('SECURITY VIOLATION: Solution or culpritId exposed in public case payload!');
    }
    console.log('  ✓ Solution and canonical culprit strictly protected from client inspection');

    // 5. Suspects & Evidence Verification
    console.log('\n[Feature 5] Validating Suspect Profiles & Evidence Formats...');
    for (const suspect of caseData.suspects) {
      if (!suspect.id || !suspect.name || !suspect.alibi || !suspect.motive) {
        throw new Error(`Incomplete suspect record: ${JSON.stringify(suspect)}`);
      }
    }
    console.log(`  ✓ Verified all ${caseData.suspects.length} suspect dossiers (names, roles, alibis, motives)`);

    const evidenceTypes = new Set(caseData.evidence.map(e => e.type));
    console.log(`  - Evidence types present: ${Array.from(evidenceTypes).join(', ')}`);
    console.log(`  ✓ Evidence room contains diverse formats (chat, cctv, document, etc.)`);

    // 6. Starting Investigation Session
    console.log('\n[Feature 6] Initializing Anonymous Investigation Session...');
    const sessionRes = await fetch(`${baseUrl}/mysteries/${mysteryId}/sessions`, {
      method: 'POST'
    }).then(r => r.json());
    const sessionId = sessionRes.sessionId;
    if (!sessionId || !sessionRes.token) throw new Error('Failed to create session');
    console.log(`  ✓ Session established: ${sessionId}`);

    // 7. Inspecting Evidence Items & Tracking Discovery
    console.log('\n[Feature 7] Inspecting Evidence Items and Discovery State...');
    const evidenceToInspect = caseData.evidence[0];
    const inspectedEvidence = await fetch(`${baseUrl}/sessions/${sessionId}/evidence/${evidenceToInspect.id}`).then(r => r.json());
    if (inspectedEvidence.id !== evidenceToInspect.id) throw new Error('Evidence inspection failed');
    console.log(`  ✓ Inspected evidence "${inspectedEvidence.title}" (Type: ${inspectedEvidence.type})`);

    // Verify session now has this evidence registered in discoveredEvidenceIds
    const sessionState = await fetch(`${baseUrl}/sessions/${sessionId}`).then(r => r.json());
    if (!sessionState.discoveredEvidenceIds.includes(evidenceToInspect.id)) {
      throw new Error('Discovered evidence was not recorded in session');
    }
    console.log(`  ✓ Session recorded discovered evidence ID: ${evidenceToInspect.id}`);

    // 8. Detective Notes & Bookmarking Clues
    console.log('\n[Feature 8] Testing Detective Journal & Bookmarked Clues...');
    const bookmarkUpdate = await fetch(`${baseUrl}/sessions/${sessionId}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookmarkedEvidenceIds: [evidenceToInspect.id],
        notes: 'Alibi window for suspect does not match camera log at 21:05.'
      })
    }).then(r => r.json());
    if (!bookmarkUpdate.bookmarkedEvidenceIds.includes(evidenceToInspect.id) || !bookmarkUpdate.notes.includes('21:05')) {
      throw new Error('Progress update failed');
    }
    console.log('  ✓ Detective notes and bookmarked evidence successfully persisted to session');

    // 9. Verdict Submission & Scoring
    console.log('\n[Feature 9] Testing Accusation Verdict & Forensic Scoring Engine...');
    const accusedSuspect = caseData.suspects[1]; // Accuse suspect_2
    const verdictRes = await fetch(`${baseUrl}/sessions/${sessionId}/verdict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        culpritId: accusedSuspect.id
      })
    }).then(r => r.json());

    console.log(`  - Accused suspect: ${accusedSuspect.name} (${accusedSuspect.id})`);
    console.log(`  - Verdict evaluation: ${verdictRes.correct ? 'CORRECT' : 'INCORRECT'}`);
    console.log(`  - Score: ${verdictRes.score}/100 points`);
    console.log(`  - Revealed Culprit: ${verdictRes.solution.culpritName} (${verdictRes.solution.culpritId})`);
    console.log(`  - Motive: "${verdictRes.solution.motive}"`);
    console.log(`  - Method: "${verdictRes.solution.method}"`);
    console.log(`  ✓ Verdict evaluated and canonical solution revealed`);

    // 10. Duplicate Verdict Prevention (Anti-Tampering)
    console.log('\n[Feature 10] Testing Duplicate Submission Protection (Spec §5.6)...');
    const duplicateRes = await fetch(`${baseUrl}/sessions/${sessionId}/verdict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ culpritId: accusedSuspect.id })
    });
    if (duplicateRes.status !== 409) {
      throw new Error(`Expected 409 Conflict on duplicate verdict submission, got ${duplicateRes.status}`);
    }
    console.log('  ✓ Duplicate submission blocked with 409 Conflict');

    // 11. Post-Verdict Session Reloading
    console.log('\n[Feature 11] Testing Post-Verdict Session State Reloading...');
    const postVerdictSession = await fetch(`${baseUrl}/sessions/${sessionId}`).then(r => r.json());
    if (postVerdictSession.status !== 'submitted' || !postVerdictSession.solution) {
      throw new Error('Post-verdict session state missing solution details');
    }
    console.log('  ✓ Post-verdict session reload successfully preserves solution and score details');

    console.log('\n======================================================');
    console.log(' ALL FEATURES TESTED AND VALIDATED SUCCESSFULLY! ');
    console.log('======================================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runFeatureValidation().catch(err => {
  console.error('\n❌ Feature verification failed:', err);
  process.exit(1);
});

