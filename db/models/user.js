import mongoose,{Schema} from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    age: {
        type: Number, 
        required: true
    },
    height: {
        type: Number, 
        required: true
    },
    streak: {
        type: Number, 
        default: 0
    }
});

export const BotUser = mongoose.model('BotUser', UserSchema);