import { z } from 'zod';
import { env } from '../config/env.js';

export const createMysteryInputSchema = z.object({
  premise: z.string({
    required_error: 'Please provide a valid mystery premise or crime scenario.',
  })
  .trim()
  .min(10, 'Premise must be at least 10 characters long.')
  .max(env.MAX_SCENARIO_LENGTH, `Premise cannot exceed ${env.MAX_SCENARIO_LENGTH} characters.`),
  
  genre: z.enum(['crime', 'noir', 'thriller', 'sci-fi', 'heist', 'supernatural'])
    .default('crime'),
    
  difficulty: z.enum(['easy', 'medium', 'hard'])
    .default('medium'),
    
  suspectCount: z.coerce.number()
    .int()
    .min(3, 'At least 3 suspects are required.')
    .max(5, 'Maximum 5 suspects are allowed.')
    .default(4),
    
  setting: z.string().trim().max(200).optional().default(''),
  tone: z.string().trim().max(100).optional().default(''),
});

export const verdictSubmissionSchema = z.object({
  culpritId: z.string({
    required_error: 'You must select a suspect ID for the verdict.',
  }).trim().min(1, 'Culprit ID is required.'),
});

export const progressUpdateSchema = z.object({
  discoveredEvidenceIds: z.array(z.string()).optional(),
  bookmarkedEvidenceIds: z.array(z.string()).optional(),
  notes: z.string().max(10000).optional(),
});
