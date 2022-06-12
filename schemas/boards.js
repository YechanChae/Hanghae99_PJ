const mongoose = require("mongoose");

const boardsSchema = new mongoose.Schema({
    boardId : {
        type: Number,
        required: true,
        unique: true,
    },
    name : {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    title: {
        type: String,
    },
    imgUrl : {
        type: String,
    }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Boards", boardsSchema);

