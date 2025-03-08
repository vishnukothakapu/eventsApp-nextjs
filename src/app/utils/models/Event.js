import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required:true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true, 
    },
    location: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    onlineLink: {
        type: String,
    },
    image: {
        type: String, 
        default: '',
    },
    tags:[
        {
            type:String,
            trim:true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }); 

const EventModel = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default EventModel;
