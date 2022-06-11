const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    boardId: {
        type: Number,
        required: true,
    },
    commentId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);