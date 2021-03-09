import mongoose from 'mongoose';

const messages = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
})

const Rooms = mongoose.Schema({
    room: String,
    messages: [messages],
});
export default mongoose.model('rooms', Rooms);