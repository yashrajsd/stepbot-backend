import mongoose, { Schema } from "mongoose";

const ReminderSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    remindAt: {
        type: Date,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Reminder = mongoose.model("Reminder", ReminderSchema);
