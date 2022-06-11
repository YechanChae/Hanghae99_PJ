const express = require("express")
const Boards = require("../schemas/boards");
const router = express.Router();

//게시글 생성(로그인시 가능)
router.post('/boards', async (req, res) => {
    const { boardsId, name, title, content } = req.body;
    // const { user } = res.locals;
    const boards = await Boards.find({ boardsId }); 

    const createdBoards = await Boards.create({ boardsId, name, title, content})
    console.log(createdBoards)
    console.log(boards);
    
    res.json({ boards : createdBoards});
});

//게시글 
module.exports = router;