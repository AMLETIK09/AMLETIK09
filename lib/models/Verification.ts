import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  verificationToken: { type: String },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
