import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  background: { type: String, required: true },
  motive: { type: String, required: true },
  alibi: { type: String, required: true },
  portraitAssetId: { type: String, default: null },
  publicFacts: [{ type: String }],
}, { _id: false });

const TimelineEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: String, required: true },
  description: { type: String, required: true },
  relatedSuspectIds: [{ type: String }],
  relatedEvidenceIds: [{ type: String }],
  isConfirmed: { type: Boolean, default: true },
}, { _id: false });

const EvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['chat', 'image', 'cctv', 'document', 'timeline', 'witness_statement'],
    required: true,
  },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  assetIds: [{ type: String }],
  relatedSuspectIds: [{ type: String }],
  timelineEventIds: [{ type: String }],
  clueType: {
    type: String,
    enum: ['direct', 'circumstantial', 'red_herring', 'contextual'],
    default: 'circumstantial',
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  sourceDescription: { type: String, required: true },
  eventTimestamp: { type: String },
  fictional: { type: Boolean, default: true },
}, { _id: false });

const SolutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true },
  motive: { type: String, required: true },
  method: { type: String, required: true },
  opportunity: { type: String, required: true },
  timelineExplanation: { type: String, required: true },
  evidenceReasoning: [{
    evidenceId: { type: String, required: true },
    explanation: { type: String, required: true },
  }],
  redHerringExplanation: { type: String, required: true },
}, { _id: false });

const MysterySchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  genre: {
    type: String,
    enum: ['crime', 'noir', 'thriller', 'sci-fi', 'heist', 'supernatural'],
    default: 'crime',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  caseBrief: { type: String, required: true },
  incident: {
    description: { type: String, required: true },
    location: { type: String, required: true },
    incidentTime: { type: String, required: true },
  },
  suspects: [SuspectSchema],
  timeline: [TimelineEventSchema],
  evidence: [EvidenceSchema],
  
  // PROTECTED: Must never be included in public mystery API responses!
  solution: { type: SolutionSchema, required: true, select: false },

  generationStatus: {
    type: String,
    enum: ['queued', 'generating', 'validating', 'ready', 'failed'],
    default: 'ready',
  },
  schemaVersion: { type: Number, default: 1 },
  promptVersion: { type: String, default: '1.0' },
}, {
  timestamps: true,
});

// Helper method to guarantee that solution is NEVER serialized in public responses
MysterySchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.solution;
  return obj;
};

export const Mystery = mongoose.model('Mystery', MysterySchema);
