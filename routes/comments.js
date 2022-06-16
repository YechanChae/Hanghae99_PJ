const express = require("express");
const Comment = require("../schemas/comments");
const authMiddleWare = require('../middlewares/auth');
const router = express.Router();

/** Schemas
 * @swagger∂
 * components:
 *     schemas:
 *        Comment:
 *          type: object
 *          required:
 *             - boardId
 *             - commentId
 *             - name
 *             - comment
 *          properties:
 *              boardId:
 *                  type: Number
 *                  description: 게시물 아이디
 *              commentId:
 *                   type: Number
 *                   description: 댓글 아이디
 *              name:
 *                    type: string
 *                    description: 댓글 작성자
 *              comment:
 *                    type: string
 *                    description: 댓글
 *          example:
 *              boardId: 1
 *              commentId: 1
 *              name: sophie
 *              comment: your pet is very cute
 */



/**
 * @swagger
 * /api/boards/{boardId}/comments:
 *  get:
 *      tags: [Comment]
 *      summary: 댓글 조회
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
 *                                  $ref: '#/components/schemas/Comment/boardId'
 *                              name:
 *                                  $ref: '#/components/schemas/Comment/name'
 *                              comment:
 *                                  $ref: '#/components/schemas/Comment/comment'
 *                          example:
 *                              boardId: 1
 *                              name: sophie
 *                              comment: awesome                         
 */

// 댓글 조회
router.get('/boards/:boardId/comments', authMiddleWare, async (req, res) => {
    const boardId = req.params.boardId;

    const comments = await Comment.find({ boardId: Number(boardId) });
    res.json({ comments: comments });
})

/**
 * @swagger
 * /api/boards/{boardId}/comments:
 *  post:
 *      tags: [Comment]
 *      summary: 댓글 작성
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
 *                          comment:
 *                              $ref: '#/components/schemas/Comment/comment'
 *                      example:
 *                          comment: good
 *                                 
 *  
 *      responses:
 *          200:
 *              description: 댓글 작성 완료
 *          400:
 *              description: 댓글 작성 오류
 */

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
        let commentId = 1;

        if (maxCommentId) {
            commentId = maxCommentId.commentId + 1
        }
        
        const CreateComments = await Comment.create({ 
            boardId : Number(boardId),
            commentId : Number(commentId),
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

/**
 * @swagger
 * /api/boards/{boardId}/comments/{commentId}:
 *  put:
 *      tags: [Comment]
 *      summary: 댓글 수정
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
 *        - name: commentId
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
 *                          comment:
 *                              type: string
 *                      example:
 *                           comment: modify
 *                                 
 *  
 *      responses:
 *          200:
 *              description: 댓글 수정 완료
 *          401:
 *              description: 댓글 수정 권한 없음
 */

// 댓글 수정
router.put('/boards/:boardId/comments/:commentId', authMiddleWare, async (req, res) => {
    const user = res.locals.user;
    const commentId = req.params.commentId;
    const boardId = req.params.boardId;
    const { comment } = req.body;

    const item = await Comment.findOne({ commentId: Number(commentId) });
    console.log(user.name)
    console.log(item.name)
    if (user.name === item.name) {
        await Comment.updateOne({ commentId: Number(commentId) }, { $set: { comment } });
        res.json({
            commentId : Number(commentId),
            boardId : Number(boardId),
            comment,
            success: true });
    } else {
        res.status(401).send({
            msg: "댓글 수정 권한이 없습니다."
        })
    }
})

/**
 * @swagger
 * /api/boards/{boardId}/comments/{commendId}:
 *  delete:
 *      tags: [Comment]
 *      summary: 댓글 삭제
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
 *        - name: commentId
 *          in: path
 *          type: string
 *          required: true                         
 *  
 *      responses:
 *          200:
 *              description: 댓글 삭제 완료
 *          401:
 *              description: 댓글 삭제 권한 없음
 */

// 댓글 삭제
router.delete('/boards/:boardId/comments/:commentId', authMiddleWare, async (req, res) => {
    try{
        const user = res.locals.user;
        const commentId = req.params.commentId;
        const boardId = req.params.boardId;           
        const item = await Comment.findOne({ commentId: Number(commentId) });

        if (user.name === item.name) {
            await Comment.deleteOne({ commentId: Number(commentId) });
             res.json({
                commentId : Number(commentId),
                boardId : Number(boardId),
                success: true 
            });
            } else {
                res.status(401).send({
                    msg: "댓글 삭제 권한이 없습니다."
                })
            }
    } catch (err) {
        res.send({ msg : "오류!"})
    }
    
})

module.exports = router;