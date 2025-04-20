const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    likes: {
        type: Number,
        default: 0, 
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
        ref: "User", 
        default: [],
    },
},{timestamps:true});

module.exports = mongoose.model('Post', postSchema);
