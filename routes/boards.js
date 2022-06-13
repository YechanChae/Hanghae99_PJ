const express = require("express")
const Boards = require("../schemas/boards");
const router = express.Router();
const authMiddleWare = require('../middlewares/auth');

//게시글 생성(로그인시 가능)
router.post('/boards', authMiddleWare, async (req, res) => {
    try {
        const {name} = res.locals.user;
        const maxBoardId = await Boards.findOne().sort("-boardId").exec()
        let boardId = 1
        if (maxBoardId) {
            boardId = maxBoardId.boardId+1
        }
        const createdBoards = await Boards.create({
            boardId: boardId,
            name: name,
            title: req.body.title,
            content: req.body.title
        });

            res.json({ boards : createdBoards});  
    } catch (err) {
        res.status(400).send({
            errorMessage: "게시글 작성 오류"
        })
    }
});

//전체 게시글 조회(로그인 필요x)
router.get('/boards', async (req, res) => {
    
    const boards = await Boards.find({}, { boardId : 1, name: 1, title: 1, content: 1});
    console.log(boards)
    res.json({
        boards,
    });
});

//게시글 상세조회
router.get('/boards/:boardId', authMiddleWare, async (req, res) => {
    const { boardId } = req.params;

    const [detail] = await Boards.find({ boardId: Number(boardId) }) 
    console.log(detail)
    res.json({detail});
});

//게시글 수정(로그인 필요)

router.put('/boards/:boardId', authMiddleWare, async (req, res) => {
    const { boardId } = req.params;
    const { title, content } = req.body;

    const isIdInBoard = await Boards.find({ boardId });
    if ( isIdInBoard.length > 0) {
        await Boards.updateOne(
            { boardId: Number(boardId)}, 
            { $set: { title, content } }
        );
    }
    res.send({ success: true });
});

//게시글 삭제(로그인 필요)
router.delete('/boards/:boardId', authMiddleWare, async (req, res) => {
    const {boardId} = req.params;
    
    const isIdInBoard = await Boards.find({ boardId });
    if (isIdInBoard.length > 0) {
        await Boards.deleteOne({ boardId});
    }
    res.send({ success: true });
});

// 게시글 좋아요 기능
router.put('/boards/:boardId/like', authMiddleWare, async (req, res) => {
    try {
        const {name} = res.locals.user;
        console.log(name)
        const {boardId} = req.params;
        const board = await Boards.findOne({ boardId: Number(boardId) });
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

