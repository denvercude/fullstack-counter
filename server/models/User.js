import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);