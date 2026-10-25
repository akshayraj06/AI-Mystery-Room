import { InvestigationSession } from '../models/InvestigationSession.js';
import { Mystery } from '../models/Mystery.js';
import { ApiError } from '../utils/apiError.js';

export async function evaluateVerdict(sessionId, culpritId) {
  // 1. Fetch Session
  const session = await InvestigationSession.findById(sessionId);
  if (!session) {
    throw ApiError.notFound('Investigation session not found.');
  }

  // 2. Prevent duplicate submissions if already completed
  if (session.status === 'submitted') {
    throw ApiError.conflict('Verdict has already been submitted for this investigation session.');
  }

  // 3. Load mystery including protected solution (+solution)
  const mystery = await Mystery.findById(session.mysteryId).select('+solution');
  if (!mystery) {
    throw ApiError.notFound('Associated mystery record not found.');
  }

  // 4. Verify selected suspect exists in this mystery
  const suspectExists = mystery.suspects.some(s => s.id === culpritId);
  if (!suspectExists) {
    throw ApiError.badRequest(`Selected suspect ID '${culpritId}' is not part of this investigation.`);
  }

  // 5. Compare IDs (server-authoritative deterministic evaluation)
  const canonicalCulpritId = mystery.solution.culpritId;
  const isCorrect = culpritId === canonicalCulpritId;

  // 6. Calculate deterministic score (Spec §5.6)
  // - Correct culprit: 60 pts
  // - Discovered evidence ratio: up to 25 pts
  // - Bookmarked / inspected clues: up to 15 pts
  const totalEvidence = mystery.evidence.length || 1;
  const discoveredCount = (session.discoveredEvidenceIds || []).length;
  const evidenceScore = Math.min(25, Math.round((discoveredCount / totalEvidence) * 25));
  const bookmarkedScore = Math.min(15, (session.bookmarkedEvidenceIds || []).length * 5);
  const score = (isCorrect ? 60 : 15) + evidenceScore + bookmarkedScore;

  // 7. Persist verdict
  session.status = 'submitted';
  session.verdict = {
    selectedSuspectId: culpritId,
    submittedAt: new Date(),
    isCorrect,
    score,
  };
  await session.save();

  // 8. Return result and canonical solution explanation
  return {
    correct: isCorrect,
    selectedSuspectId: culpritId,
    score,
    solution: {
      culpritId: canonicalCulpritId,
      culpritName: mystery.suspects.find(s => s.id === canonicalCulpritId)?.name || 'Unknown',
      motive: mystery.solution.motive,
      method: mystery.solution.method,
      opportunity: mystery.solution.opportunity,
      timelineExplanation: mystery.solution.timelineExplanation,
      evidenceReasoning: mystery.solution.evidenceReasoning,
      redHerringExplanation: mystery.solution.redHerringExplanation,
    },
  };
}
