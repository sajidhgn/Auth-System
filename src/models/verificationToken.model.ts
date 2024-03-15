import mongoose, { Schema } from 'mongoose';

const VerificationCodeSchema: Schema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, expires: 60, default: Date.now }
});

VerificationCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const VerificationCodeModel = mongoose.model('VerificationCodes', VerificationCodeSchema);