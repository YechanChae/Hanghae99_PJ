const express = require("express")
const Board = require("../schemas/boards");
const authMiddleware = require("./auth-middleware");
const router = express.Router();

// 게시글 좋아요 기능
router.put('/boards/:boardId/like', authMiddleware, async (req, res) => {
    try {
        const {name} = res.locals.user;
        const {boardId} = req.params;
        const board = await Board.findOne({ boardId: Number(boardId) });
        // 좋아요 추가했을 때
        if (!board.likes.includes(name)) {
            await board.updateOne({$push: { likes: name }});
            res.status(201).send({
                success: true,
                msg: "좋아요가 추가되었습니다."
            });
        // 좋아요 취소했을 때
        } else { 
            await board.updateOne({ $pull: { likes: name }});
            res.status(201).send({
                success: true,
                msg: "좋아요가 취소되었습니다."
            });
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router