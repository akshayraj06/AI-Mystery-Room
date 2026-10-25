import crypto from 'crypto';
import { InvestigationSession } from '../models/InvestigationSession.js';
import { Mystery } from '../models/Mystery.js';
import { evaluateVerdict } from '../services/verdictService.js';
import { verdictSubmissionSchema, progressUpdateSchema } from '../validators/mysteryValidator.js';
import { ApiError } from '../utils/apiError.js';

export async function createSession(req, res, next) {
  try {
    const { mysteryId } = req.params;
    const mystery = await Mystery.findById(mysteryId);
    if (!mystery) {
      throw ApiError.notFound('Mystery case not found.');
    }

    // High entropy token hash for secure anonymous session tracking
    const rawToken = crypto.randomBytes(24).toString('hex');
    const sessionTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const session = new InvestigationSession({
      mysteryId,
      sessionTokenHash,
      discoveredEvidenceIds: [],
      bookmarkedEvidenceIds: [],
    });
    await session.save();

    res.status(201).json({
      sessionId: session._id,
      mysteryId: session.mysteryId,
      token: rawToken,
      status: session.status,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const session = await InvestigationSession.findById(sessionId);
    if (!session) {
      throw ApiError.notFound('Session not found.');
    }
    res.status(200).json({
      sessionId: session._id,
      mysteryId: session.mysteryId,
      status: session.status,
      discoveredEvidenceIds: session.discoveredEvidenceIds,
      bookmarkedEvidenceIds: session.bookmarkedEvidenceIds,
      notes: session.notes,
      verdict: session.verdict,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEvidence(req, res, next) {
  try {
    const { sessionId, evidenceId } = req.params;
    const session = await InvestigationSession.findById(sessionId);
    if (!session) {
      throw ApiError.notFound('Session not found.');
    }

    const mystery = await Mystery.findById(session.mysteryId);
    if (!mystery) {
      throw ApiError.notFound('Case not found.');
    }

    const evidenceItem = mystery.evidence.find(e => e.id === evidenceId);
    if (!evidenceItem) {
      throw ApiError.notFound(`Evidence item '${evidenceId}' not found in this investigation.`);
    }

    // Record discovered evidence if not already present
    if (!session.discoveredEvidenceIds.includes(evidenceId)) {
      session.discoveredEvidenceIds.push(evidenceId);
      await session.save();
    }

    res.status(200).json(evidenceItem);
  } catch (err) {
    next(err);
  }
}

export async function updateProgress(req, res, next) {
  try {
    const { sessionId } = req.params;
    const validatedData = progressUpdateSchema.parse(req.body);

    const session = await InvestigationSession.findById(sessionId);
    if (!session) {
      throw ApiError.notFound('Session not found.');
    }

    if (validatedData.discoveredEvidenceIds) {
      session.discoveredEvidenceIds = Array.from(new Set([
        ...session.discoveredEvidenceIds,
        ...validatedData.discoveredEvidenceIds,
      ]));
    }

    if (validatedData.bookmarkedEvidenceIds) {
      session.bookmarkedEvidenceIds = validatedData.bookmarkedEvidenceIds;
    }

    if (typeof validatedData.notes === 'string') {
      session.notes = validatedData.notes;
    }

    await session.save();

    res.status(200).json({
      sessionId: session._id,
      discoveredEvidenceIds: session.discoveredEvidenceIds,
      bookmarkedEvidenceIds: session.bookmarkedEvidenceIds,
      notes: session.notes,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitVerdictController(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { culpritId } = verdictSubmissionSchema.parse(req.body);

    const result = await evaluateVerdict(sessionId, culpritId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
