import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, index: true },
    code: { type: String },
    expiresAt: { type: Date },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export const setOtp = async (phoneNumber, code, ttlSeconds = 300) => {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  await Otp.findOneAndUpdate(
    { phoneNumber },
    { code, expiresAt, attempts: 0 },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return true;
};

export const verifyOtp = async (phoneNumber, code) => {
  const record = await Otp.findOne({ phoneNumber });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  const match = record.code === code;
  if (match) {
    await Otp.deleteOne({ phoneNumber });
    return true;
  }
  await Otp.updateOne({ phoneNumber }, { $inc: { attempts: 1 } });
  return false;
};
