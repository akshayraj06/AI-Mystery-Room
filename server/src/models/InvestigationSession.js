import mongoose from 'mongoose';

const InvestigationSessionSchema = new mongoose.Schema({
  mysteryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mystery',
    required: true,
    index: true,
  },
  sessionTokenHash: {
    type: String,
    required: true,
    index: true,
  },
  discoveredEvidenceIds: [{
    type: String,
  }],
  bookmarkedEvidenceIds: [{
    type: String,
  }],
  notes: {
    type: String,
    default: '',
  },
  verdict: {
    selectedSuspectId: { type: String },
    submittedAt: { type: Date },
    isCorrect: { type: Boolean },
    score: { type: Number },
  },
  status: {
    type: String,
    enum: ['active', 'submitted', 'abandoned'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export const InvestigationSession = mongoose.model('InvestigationSession', InvestigationSessionSchema);
