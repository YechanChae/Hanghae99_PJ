const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    boardId: {
        type: String,
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
});

module.exports = mongoose.model("Comment", commentSchema);