import mongoose from 'mongoose';

export interface ITrip {
    ownerId: mongoose.Schema.Types.ObjectId;
    prompt: string;
    response: string;
    createdAt: Date;
}

const tripSchema = new mongoose.Schema<ITrip>({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const tripModel = mongoose.model('Trip', tripSchema);

export default tripModel;