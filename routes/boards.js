const express = require("express")
const Boards = require("../schemas/boards");
const router = express.Router();

//게시글 생성(로그인시 가능)
router.post('/boards', async (req, res) => {
    try {
        const maxBoardsId = await Boards.findOne().sort("-boardsId").exec()
        let boardsId = 1
        if (maxBoardsId) {
            boardsId = maxBoardsId.boardsId+1
        }

        const createdBoards = await Boards.create({
            boardsId: boardsId,
            name: req.body.name,
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
    
    const boards = await Boards.find({}, { boardsId : 1, name: 1, title: 1, content: 1});
    console.log(boards)
    res.json({
        boards,
    });
});

//게시글 상세조회
router.get('/boards/:boardId', async (req, res) => {
    const { boardId } = req.params;

    const [detail] = await Boards.find({ boardId: Number(boardId) }) 
    console.log(detail)
    res.json({detail});
});


module.exports = router;