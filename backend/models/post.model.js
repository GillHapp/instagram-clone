import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);