const express = require("express");
const Comment = require("../schemas/comments");
const authMiddleWare = require('../middlewares/auth');
const router = express.Router();

// 댓글 조회
router.get('/boards/:boardId/comments', authMiddleWare, async (req, res) => {
    const boardId = req.params.boardId;

    const comments = await Comment.find({ boardId: Number(boardId) });
    res.json({ comments: comments });
})

// 댓글 작성
router.post('/boards/:boardId/comments', authMiddleWare, async (req, res) => {
    const user = res.locals.user;
    const boardId = req.params.boardId;
    const { commentId, comment } = req.body;

    if (!comment) {     // 댓글 내용이 없을 경우
        res.status(400).send({
            errorMessage: "댓글 내용을 입력해주세요."
        })
        return;
    }
    const item = Comment.create({ boardId, commentId, name: user.name, comment });
    res.json({ success: true });
})