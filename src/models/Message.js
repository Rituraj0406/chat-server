import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        trim: true,
        default: ''
    },
    attachments: [
        {
            name: String,
            url: String,
            type: String,
            size: String
        },
    ],
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
    readAt: {
        type: Date,
        default: null
    }
}, {timestamp: true});

messageSchema.index({conversation: 1, createdAt: -1}); // this is used for fetching messages of a conversation in descending order of creation time

export default mongoose.model('message', messageSchema);