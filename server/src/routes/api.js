import { Router } from 'express';
import healthRouter from './health.js';
import { createMystery, getGenerationJob, getMystery } from '../controllers/mysteryController.js';
import { createSession, getSession, getEvidence, updateProgress, submitVerdictController } from '../controllers/sessionController.js';

const apiRouter = Router();

// Base health check
apiRouter.use(healthRouter);

// Mystery creation & generation jobs
apiRouter.post('/mysteries', createMystery);
apiRouter.get('/generation-jobs/:jobId', getGenerationJob);
apiRouter.get('/mysteries/:mysteryId', getMystery);

// Investigation sessions, evidence & verdicts
apiRouter.post('/mysteries/:mysteryId/sessions', createSession);
apiRouter.get('/sessions/:sessionId', getSession);
apiRouter.get('/sessions/:sessionId/evidence/:evidenceId', getEvidence);
apiRouter.patch('/sessions/:sessionId/progress', updateProgress);
apiRouter.post('/sessions/:sessionId/verdict', submitVerdictController);

export default apiRouter;
