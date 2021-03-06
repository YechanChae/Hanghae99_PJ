const express = require("express")
const Boards = require("../schemas/boards");
const router = express.Router();
const authMiddleWare = require('../middlewares/auth');
const { upload } = require('../middlewares/upload')
const moment = require('moment');

/** Schemas
 * @swagger
 * components:
 *     schemas:
 *        Board:
 *          type: object
 *          required:
 *             - boardId
 *             - name
 *             - content
 *             - title
 *             - imgUrl
 *             - likes
 *          properties:
 *              boardId:
 *                  type: Number
 *                  description: 게시물 아이디
 *              name:
 *                   type: string
 *                   description: 게시물 작성자
 *              content:
 *                    type: string
 *                    description: 게시물 내용
 *              title:
 *                    type: string
 *                    description: 게시물 제목
 *              imgUrl:
 *                    type: string
 *                    description: 게시물 사진
 *              likes:
 *                    type: Array
 *                    default: []
 *                    description: 게시물 좋아요한 사람들 목록
 *          example:
 *              boardId: 1
 *              name: jane
 *              content: my pet is awesome
 *              title: my pet
 *              likes: [sophie, bob, ...]
 */

// 사진업로드 (1개씩 저장)

// router.post('/image', upload.single('imgUrl'), async (req, res) => {
//     const file = await req.file;
//     console.log(file);
//     try {
//         const result = await file.location;
//         console.log(result);
//         //사진경로가있는 주소를  imgurl이라는 이름으로 저장
//         res.status(200).json({ imgurl: result });
//     } catch (err) {
//         res.send({ msg : "에러발생"});
        
//     }
// });

/**
 * @swagger
 * /api/boards:
 *  post:
 *      tags: [Board]
 *      summary: 게시글 작성
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          content:
 *                              type: string
 *                      example:
 *                          title: my pet
 *                          content: my pet
 *                                 
 *  
 *      responses:
 *          200:
 *              description: 게시글 작성 완료
 *          400:
 *              description: 게시글 작성 오류
 */

//게시글 생성(로그인시 가능)
router.post('/boards', authMiddleWare, upload.single('imgUrl'), async (req, res) => {
    try {
        const {name}  = res.locals.user;
        const date = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss');
        const maxBoardId = await Boards.findOne().sort("-boardId").exec()
        const file = await req.file;
        console.log("작동2")
        const result = await file.location;
        console.log("작동3")
        let boardId = 1
        if (maxBoardId) {
            boardId = maxBoardId.boardId+1
        }
        const createdBoards = await Boards.create({
            boardId: Number(boardId),
            name: name,
            title: req.body.title,
            content: req.body.content,
            imgUrl: result,
            date: date.split(' ')[0],
        });
        console.log(createdBoards)
            res.json({ boards : createdBoards});  
    } catch (err) {
        res.status(400).send({
            msg: "게시글 작성 오류"
        })
    }
});

/**
 * @swagger
 * /api/boards:
 *  get:
 *      tags: [Board]
 *      summary: 게시글 전체조회
 *      responses:
 *          200:
 *              description: 조회 성공
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              boardId:
 *                                  $ref: '#/components/schemas/Board/boardId'
 *                              name:
 *                                  $ref: '#/components/schemas/Board/name'
 *                              title:
 *                                  $ref: '#/components/schemas/Board/title'
 *                              content:
 *                                  $ref: '#/components/schemas/Board/content'
 *                              imgUrl:
 *                                  $ref: '#/components/schemas/Board/imgUrl'
 *                          example:
 *                              boardId: 1
 *                              name: jane
 *                              title: my pet
 *                              content: my pet is awesome
 *                              imgUrl: 'http://---'                              
 */

//전체 게시글 조회(로그인 필요x)
router.get('/boards', async (req, res) => {
    
    const boards = await Boards.find({}, { boardId : 1, name: 1, title: 1, content: 1, imgUrl: 1});
    console.log(boards)
    res.json({
        boards,
    });
});

/**
 * @swagger
 * /api/boards/{boardId}:
 *  get:
 *      tags: [Board]
 *      summary: 게시글 상세조회
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.
 *        - name: boardId
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: 조회 성공
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              boardId:
 *                                  $ref: '#/components/schemas/Board/boardId'
 *                              name:
 *                                  $ref: '#/components/schemas/Board/name'
 *                              title:
 *                                  $ref: '#/components/schemas/Board/title'
 *                              content:
 *                                  $ref: '#/components/schemas/Board/content'
 *                              imgUrl:
 *                                  $ref: '#/components/schemas/Board/imgUrl'
 *                          example:
 *                              boardId: 1
 *                              name: jane
 *                              title: my pet
 *                              content: my pet is awesome
 *                              imgUrl: 'http://---'                                 
 */

//게시글 상세조회
router.get('/boards/:boardId', authMiddleWare, async (req, res) => {
    try {
        const { boardId } = req.params;
        const { user } = res.locals;
        const [detail] = await Boards.find({ boardId: Number(boardId) });

        if (user.name !== detail.name) {
            await res.send({
                msg : "게시글 수정 권한이 없습니다.",
            })
            return;
        }
        res.json({detail});
        
    } catch (err) {
        res.status(400).send({
            msg: "게시글 상세조회 오류"
        })
    }
    
});

/**
 * @swagger
 * /api/boards/{boardId}:
 *  put:
 *      tags: [Board]
 *      summary: 게시글 수정
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.
 *        - name: boardId
 *          in: path
 *          type: string
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          content:
 *                              type: string
 *                          imgUrl:
 *                              type: string
 *                      example:
 *                          title: modify
 *                          content: modify
 *                          imgUrl: http://~~
 *                                 
 *      responses:
 *         200:
 *             description: 게시물 수정 완료
 *             content:
 *                 application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              boardId:
 *                                  $ref: '#/components/schemas/Board/boardId'
 *                              title:
 *                                  $ref: '#/components/schemas/Board/title'
 *                              content:
 *                                  $ref: '#/components/schemas/Board/content'
 *                              imgUrl:
 *                                  $ref: '#/components/schemas/Board/imgUrl'
 *                          example:
 *                              boardId: 1
 *                              title: modify
 *                              content: modify
 *                              imgUrl: http://~~
 *             400:
 *                  description: 게시물 수정 오류          
 */

//게시글 수정(로그인 필요)
router.put('/boards/:boardId', authMiddleWare, async (req, res) => {
    try {
        const { boardId } = req.params;
        const { title, content } = req.body;

        const { user } = res.locals;
        const list = await Boards.findOne({ boardId });
        console.log(`'이것은 username : ' ${user.name}`)
        console.log(`'이것은 listname : ' ${list.name}`)
        if ( user.name !== list.name) {
            await res.send({
                msg: "본인만 수정 가능합니다."
            })
            return;
        }

        const isIdInBoard = await Boards.find({ boardId });
        if ( isIdInBoard.length > 0) {
            await Boards.updateOne(
                { boardId: Number(boardId)}, 
                { $set: { title, content } }
            )
            res.send({ 
                msg : "게시글이 수정되었습니다.",
                success : true,
                boardId : Number(boardId),
                content,
                title,
            });
            return;
        } 
    

    } catch (err) {
        res.status(400).send({
            msg: "게시글 수정 오류"
        })
    }
   
});

/**
 * @swagger
 * /api/boards/{boardId}:
 *  delete:
 *      tags: [Board]
 *      summary: 게시글 삭제
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.
 *        - name: boardId
 *          in: path
 *          type: string
 *          required: true         
 *  
 *      responses:
 *          200:
 *              description: 게시글 삭제 완료
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              boardId:
 *                                  $ref: '#/components/schemas/Board/boardId'
 *                      example:
 *                          boardId: 1
 *          400:
 *              description: 게시글 삭제 오류
 */

//게시글 삭제(로그인 필요)
router.delete('/boards/:boardId', authMiddleWare, async (req, res) => {
    try {
         const {boardId} = req.params;
         const { user } = res.locals;
         const list = await Boards.findOne({ boardId });
         console.log(user.name)
         console.log(list.name)
         if ( user.name !== list.name) {
             await res.send({
                msg: "본인만 삭제 가능합니다."
             })
             return;
         }

        const isIdInBoard = await Boards.find({ boardId });
        if (isIdInBoard.length > 0) {
            await Boards.deleteOne({ boardId});
        }
        res.send({ 
            msg: "게시글이 삭제되었습니다.",
            boardId : Number(boardId),
            success: true
        });
        return;

        } catch (err) {
            res.status(400).send({
                msg: "게시글 삭제 오류"
            })
        }
       
});

/**
 * @swagger
 * /api/boards/{boardId}/like:
 *  put:
 *      tags: [Board]
 *      summary: 게시글 좋아요
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.
 *        - name: boardId
 *          in: path
 *          type: string
 *          required: true
 *  
 *      responses:
 *          201:
 *              description: 좋아요 추가 or 취소
 *          500:
 *              description: 오류 발생
 */

// 게시글 좋아요 기능
router.put('/boards/:boardId/like', authMiddleWare, async (req, res) => {
    try {
        const {name} = res.locals.user;
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

