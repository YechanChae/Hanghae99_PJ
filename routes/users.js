const router = require("express").Router();
const User = require("../schemas/users");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middlewares/auth');

/** Schemas
 * @swagger
 * components:
 *     schemas:
 *        User:
 *          type: object
 *          required:
 *             - userId
 *             - name
 *             - password
 *          properties:
 *              userId:
 *                  type: string
 *                  description: 이용자의 이메일
 *              name:
 *                   type: string
 *                   description: 이용자의 닉네임
 *              password:
 *                    type: string
 *                    description: 이용자의 패스워드
 *          example:
 *              userId: jane@email.com
 *              name: jane
 *              password: 1234
 */

// 회원가입 검증하기
const postUserSchema = Joi.object({
    userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}).required(),
    name: Joi.string().pattern(new RegExp('^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,8}$')).required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().min(4).required(),
});

//이메일 중복체크 검증하기
const checkIdSchema = Joi.object({
    userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}).required()
})

//이름 중복체크 검증하기
const checkNameSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,8}$')).required()
})

/**
 * @swagger
 * /api/login:
 *  post:
 *      tags: [SignUp/Login]
 *      summary: 로그인
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *                          password:
 *                              type: string
 *                      example:
 *                          userId: jane@email.com
 *                          password: 1234
 *                                 
 *      responses:
 *          200:
 *              description: 로그인 성공
 *          400:
 *              description: 로그인 실패
 */

//로그인
router.post("/login", async (req, res)=> {       //post메서드로 하는 이유는 로그인할 때 마다 마다 토큰을 생성하기때문
    try {
        const { userId, password } = req.body

        const user = await User.findOne({ userId }).exec()

        if (!user) {
            res.status(400).send({
                success: false,
                msg: "이메일 또는 비밀번호를 확인해주세요."
            })
            return
        } else {
            const correctPassword = bcrypt.compareSync(password, user.password)     //boolean이라 true,false 반환
            console.log(correctPassword)
            if (correctPassword) {

                const name = user.name
                const token = jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY)

                res.send({
                    success: true,
                    token, 
                    name
                })
            } else {
                res.status(400).send({
                    success: false,
                    msg: "이메일 또는 비밀번호를 확인해주세요."
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({
            msg: "올바른 형식이 아닙니다."
        })
    }
})

/**
 * @swagger
 * /api/check/userId:
 *  post:
 *      tags: [SignUp/Login]
 *      summary: 이메일 중복확인
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *                      example:
 *                          userId: jane@email.com
 *                                 
 *  
 *      responses:
 *          200:
 *              description: 사용가능한 이메일
 *          400:
 *              description: 이미 존재하는 이메일
 */

//이메일 중복확인
router.post("/check/userId", async (req, res)=> {
    try {
        const { userId } = await checkIdSchema.validateAsync(req.body);
        const checkId = await User.findOne({ userId }).exec()
        if (checkId) {
            res.status(400).send({
                success: false,
                msg: "이미 존재하는 이메일 입니다."
            })
            return
        } else {
            res.status(200).send({
                success: true,
                msg: "사용 가능한 이메일 입니다."
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({
            msg: "이메일 형식이 아닙니다."
        })
    }
})

/**
 * @swagger
 * /api/check/name:
 *  post:
 *      tags: [SignUp/Login]
 *      summary: 닉네임 중복확인
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                      example:
 *                          name: jane
 *                                 
 *  
 *      responses:
 *          200:
 *              description: 사용가능한 닉네임
 *          400:
 *              description: 이미 존재하는 닉네임
 */

//이름 중복확인
router.post("/check/name", async (req, res)=> {
    try {
        const { name } = await checkNameSchema.validateAsync(req.body)
        const checkName = await User.findOne({ name }).exec()
        if (checkName) {
            res.status(400).send({
                success: false,
                msg: "이미 존재하는 닉네임 입니다."
            })
            return
        } else {
            res.status(200).send({
                success: true,
                msg: "사용 가능한 닉네임 입니다."
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({
            msg: "2~8자의 한글, 영문, 숫자만 사용 가능합니다."
        })        
    }
})


/**
 * @swagger
 * /api/users:
 *  post:
 *      tags: [SignUp/Login]
 *      summary: 회원가입
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *                          name:
 *                              type: string
 *                          password:
 *                              type: string
 *                          confirmPassword:
 *                              type: string
 *                      example:
 *                          userId: jane@email.com
 *                          name: jane
 *                          password: 1234
 *                          confirmPassword: 1234
 *                                 
 *      responses:
 *          201:
 *              description: 회원가입 성공
 *          400:
 *              description: 회원가입 실패
 */

// 회원가입 API
router.post("/users", async (req, res) => {
    try {
        const { userId, name, password, confirmPassword } = await postUserSchema.validateAsync(req.body);
        // bcrypt 사용해 password 암호화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const checkIdSchema = Joi.object({
            userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}).required()
        })
        
        // 비밀번호에 name 포함여부 확인
        if (password.includes(name)) {
            res.status(400).send({
                msg: "비밀번호에 닉네임이 포함되어있습니다."
            })
            return;
        }

        // 비밀번호와 비밀번호 확인란 동일 여부 확인
        if (password !== confirmPassword) {
            res.status(400).send({
                msg: "비밀번호가 비밀번호 확인란과 동일하지 않습니다.",
            })
            return;
        }

        // 이미 존재하는 userId인지 확인
        const existUserId = await User.find({userId});
        if (existUserId.length) {
            res.status(400).send({
                msg: "이미 존재하는 이메일입니다.",
            })
            return;
        };

        // 이미 존재하는 name인지 확인
        const existName = await User.find({name});
        if (existName.length) {
            res.status(400).send({
                msg: "이미 존재하는 닉네임입니다.",
            })
            return;
        };

        // user 정보 DB 저장
        const user = new User({ userId, name, password: hashedPassword });
        await user.save();
        res.status(201).send({
            success: true,
            msg: "회원가입을 환영합니다!"
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            msg: "입력한 정보를 다시 확인해주세요.",
        });
    }
});

/**
 * @swagger
 * /api/users/me:
 *  get:
 *      tags: [SignUp/Login]
 *      summary: 회원정보 인증
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - name: token
 *          in: header
 *          description: 헤더에 토큰을 입력해주세요.                               
 *      responses:
 *          200:
 *              description: 회원정보 인증 OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  $ref: '#/components/schemas/User/name'      
 */

// 회원정보 인증
router.get('/users/me', authMiddleWare, async function (req, res) {
    const { user } = res.locals;
    res.send({
        user: {
            name: user.name
        },
    });
});

module.exports = router;