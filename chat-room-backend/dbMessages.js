import mongoose from 'mongoose';

const chat_room_Schema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
    
});

export default mongoose.model('messagecontent', chat_room_Schema);