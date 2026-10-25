import mongoose from 'mongoose';

const GenerationJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['queued', 'generating', 'validating', 'ready', 'failed'],
    default: 'queued',
    index: true,
  },
  input: {
    premise: { type: String, required: true },
    genre: { type: String, default: 'crime' },
    difficulty: { type: String, default: 'medium' },
    suspectCount: { type: Number, default: 4 },
    setting: { type: String, default: '' },
    tone: { type: String, default: '' },
  },
  mysteryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mystery',
    default: null,
  },
  progressStage: {
    type: String,
    enum: ['queued', 'designing_case', 'creating_suspects', 'creating_evidence', 'validating', 'ready', 'failed'],
    default: 'queued',
  },
  error: {
    code: { type: String },
    message: { type: String },
  },
  retryCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const GenerationJob = mongoose.model('GenerationJob', GenerationJobSchema);
