import crypto from 'crypto';
import { GenerationJob } from '../models/GenerationJob.js';
import { Mystery } from '../models/Mystery.js';
import { createMysteryInputSchema } from '../validators/mysteryValidator.js';
import { processGenerationJob } from '../services/mysteryGenerator.js';
import { ApiError } from '../utils/apiError.js';

export async function createMystery(req, res, next) {
  try {
    const validatedInput = createMysteryInputSchema.parse(req.body);
    const jobId = `job_${crypto.randomBytes(8).toString('hex')}`;

    // Create asynchronous generation job in queued state
    const job = new GenerationJob({
      jobId,
      status: 'queued',
      progressStage: 'queued',
      input: validatedInput,
    });
    await job.save();

    // Trigger asynchronous processing in background
    setImmediate(() => {
      processGenerationJob(jobId).catch(err => {
        console.error(`[Controller] Background job error:`, err);
      });
    });

    res.status(202).json({
      jobId,
      status: 'queued',
      statusUrl: `/api/v1/generation-jobs/${jobId}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getGenerationJob(req, res, next) {
  try {
    const { jobId } = req.params;
    const job = await GenerationJob.findOne({ jobId });
    if (!job) {
      throw ApiError.notFound(`Generation job '${jobId}' not found.`);
    }

    res.status(200).json({
      jobId: job.jobId,
      status: job.status,
      progressStage: job.progressStage,
      mysteryId: job.mysteryId,
      error: job.error,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMystery(req, res, next) {
  try {
    const { mysteryId } = req.params;
    const mystery = await Mystery.findById(mysteryId);
    if (!mystery) {
      throw ApiError.notFound('Investigation case not found.');
    }

    // Crucial: toPublicJSON() guarantees protected solution is never exposed
    res.status(200).json(mystery.toPublicJSON());
  } catch (err) {
    next(err);
  }
}
