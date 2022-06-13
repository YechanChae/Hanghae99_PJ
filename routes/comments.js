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
    try { 
        const user = res.locals.user;
        const boardId = req.params.boardId;
        const { comment } = req.body;
       
        if (!comment) {     // 댓글 내용이 없을 경우
            res.status(400).send({
                msg: "댓글 내용을 입력해주세요."
            })
            return;
        }
            const maxCommentId = await Comment.findOne().sort("-commentId").exec();
            let commentId = 1

        if (maxCommentId) {
            commentId = maxCommentId.commentId + 1
        }
        
        const CreateComments = await Comment.create({ 
            boardId : Number(boardId),
            commentId, 
            name: user.name, 
            comment 
        });
        res.json({ comments : CreateComments });
    } catch (err) {
        res.status(400).send({
            msg: "댓글 작성 오류"
        })
    }
})

// 댓글 수정
router.put('/boards/:boardId/comments/:commentId', authMiddleWare, async (req, res) => {
    const user = res.locals.user;
    const commentId = req.params.commentId;
    const { comment } = req.body;

    const item = await Comment.findOne({ commentId });
    console.log(user.name)
    console.log(item.name)
    if (user.name === item.name) {
        await Comment.updateOne({ commentId }, { $set: { comment } });
    } 

    res.json({ success: true });
})

// 댓글 삭제
router.delete('/boards/:boardId/comments/:commentId', authMiddleWare, async (req, res) => {
    const user = res.locals.user;
    const commentId = req.params.commentId;

    const item = await Comment.findOne({ commentId });
    if (user.name === item.name) {
        await Comment.deleteOne({ commentId });
    }

    res.json({ success: true });
})

module.exports = router;