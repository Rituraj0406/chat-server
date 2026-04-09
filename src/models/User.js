import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    lastSeenAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

userSchema.index({ name: 'text', email: 'text' }); // this is used for searching users by name or email 
export default mongoose.model('User', userSchema);