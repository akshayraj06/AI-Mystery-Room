import { GenerationJob } from '../models/GenerationJob.js';
import { Mystery } from '../models/Mystery.js';
import { generateMysteryFromAI } from './geminiService.js';
import { validateMysteryConsistency } from './consistencyValidator.js';
import { env } from '../config/env.js';

export async function processGenerationJob(jobId) {
  const job = await GenerationJob.findOne({ jobId });
  if (!job) {
    console.error(`[MysteryGenerator] Job not found: ${jobId}`);
    return null;
  }

  job.status = 'generating';
  job.progressStage = 'designing_case';
  await job.save();

  try {
    // Stage A & B: Blueprint & Evidence Synthesis
    job.progressStage = 'creating_suspects';
    await job.save();

    const rawMystery = await generateMysteryFromAI(job.input);

    job.progressStage = 'creating_evidence';
    await job.save();

    // Stage C: Consistency Validation
    job.progressStage = 'validating';
    await job.save();

    let validation = validateMysteryConsistency(rawMystery);

    // Stage D: Bounded Repair if needed
    if (!validation.valid && job.retryCount < env.GENERATION_MAX_RETRIES) {
      console.warn(`[MysteryGenerator] Validation errors on job ${jobId}:`, validation.errors);
      job.retryCount += 1;
      await job.save();

      // Retry generation
      const repairedMystery = await generateMysteryFromAI(job.input);
      validation = validateMysteryConsistency(repairedMystery);
      if (validation.valid) {
        Object.assign(rawMystery, repairedMystery);
      }
    }

    if (!validation.valid) {
      throw new Error(`Consistency validation failed: ${validation.errors.join('; ')}`);
    }

    // Stage E: Publication & Atomic Persistence
    const mystery = new Mystery(rawMystery);
    await mystery.save();

    job.mysteryId = mystery._id;
    job.status = 'ready';
    job.progressStage = 'ready';
    await job.save();

    console.log(`[MysteryGenerator] Mystery '${mystery.title}' created successfully for job ${jobId}`);
    return mystery;
  } catch (err) {
    console.error(`[MysteryGenerator] Generation failed for job ${jobId}:`, err);
    job.status = 'failed';
    job.progressStage = 'failed';
    job.error = {
      code: 'GENERATION_ERROR',
      message: err.message || 'Failed to complete mystery synthesis.',
    };
    await job.save();
    return null;
  }
}
