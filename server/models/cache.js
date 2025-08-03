import mongoose from 'mongoose';

const cachedListSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed },
    expiry: { type: Date, required: true }
});

cachedListSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('CachedList', cachedListSchema);