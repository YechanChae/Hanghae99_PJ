const express = require("express")
const router = express.Router();
const User = require("../schemas/users");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const authMiddleware = require("./auth-middleware");

// 회원가입 검증하기
const postUserSchema = Joi.object({
    userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}).required(),
    name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().min(4).required(),
});
//이메일 중복체크 검증하기
const checkIdSchema = Joi.object({
    userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}).required()
})
//이름 중복체크 검증하기
const checkNameSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})


//로그인
router.post("/login", async (req, res)=> {       //post메서드로 하는 이유는 로그인할 때 마다 마다 토큰을 생성하기때문
    const { userId, password } = req.body

    const user = await User.findOne({ userId }).exec()

    if (!user) {
        res.status(400).send({
            errorMessage: "이메일 또는 패스워드를 확인해주세요1."
        })
        return
    } else {
        const correctPassword = bcrypt.compareSync(password, user.password)     //boolean이라 true,false 반환
        console.log(correctPassword)
        if (correctPassword) {
            const userName = user.name
            const token = jwt.sign({ userId: user.userId }, "whi-secret-key")
            console.log( userId, userName )
            res.send({
                token, userId, userName
            })
        } else {
            res.status(400).send({
                errorMessage: "이메일 또는 패스워드를 확인해주세요2."
            })
        }
    }
    
})

//이메일 중복확인
router.post("/check/userId", async (req, res)=> {
    try {
        const { userId } = await checkIdSchema.validateAsync(req.body);
        const checkId = await User.findOne({ userId }).exec()
        if (checkId) {
            res.status(400).send({
                success: false,
                msg: "이미 존재하는 이메일입니다."
            })
            return
        } else {
            res.status(200).send({
                success: true,
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: "이메일 형식이 아닙니다."
        })
    }
    // const { userId } = await checkIdSchema.validateAsync(req.body);
    // const checkId = await User.findOne({ userId }).exec()
    // if (checkId) {
    //     res.status(400).send({
    //         success: false,
    //         msg: "이미 존재하는 이메일입니다."
    //     })
    //     return
    // } else {
    //     res.status(200).send({
    //         success: true,
    //     })
    // }
})

//이름 중복확인
router.post("/check/name", async (req, res)=> {
    try {
        const { name } = await checkNameSchema.validateAsync(req.body)
        const checkName = await User.findOne({ name }).exec()
        if (checkName) {
            res.status(400).send({
                success: false,
                msg: "이미 존재하는 이름입니다."
            })
            return
        } else {
            res.status(200).send({
                success: true,
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: "3~30자의 영문, 숫자만 사용 가능합니다."
        })        
    }
    // const { name } = req.body
    // const checkName = await User.findOne({ name }).exec()
    // if (checkName) {
    //     res.status(400).send({
    //         success: false,
    //         msg: "이미 존재하는 이름입니다."
    //     })
    //     return
    // } else {
    //     res.status(200).send({
    //         success: true,
    //     })
    // }
})


// 회원가입 API
router.post("/users", async (req, res) => {
    try {
        const { userId, name, password, confirmPassword } = await postUserSchema.validateAsync(req.body);
        // bcrypt 사용해 password 암호화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // 패스워드에 name 포함여부 확인
        if (password.includes(name)) {
            res.status(400).send({
                errorMessage: "비밀번호에 이름이 포함되어있습니다."
            })
            return;
        }

        // 패스워드와 패스워드 확인란 동일 여부 확인
        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
            })
            return;
        }

        // 이미 존재하는 userId인지 확인
        const existUserId = await User.find({userId});
        if (existUserId.length) {
            res.status(400).send({
                errorMessage: "이미 존재하는 이메일입니다.",
            })
            return;
        };

        // 이미 존재하는 name인지 확인
        const existName = await User.find({name});
        if (existName.length) {
            res.status(400).send({
                errorMessage: "이미 존재하는 이름입니다.",
            })
            return;
        };

        // user 정보 DB 저장
        const user = new User({ userId, name, password: hashedPassword });
        await user.save();
        res.status(201).send({
            success: true,
            msg: "회원가입성공"
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "입력한 정보를 다시 확인해주세요.",
        });
    }
});

// 회원정보 조회
router.get('/users/me', authMiddleware, async function (req, res) {
    const { user } = res.locals;
    res.send({
        user: {
            name: user.name
        },
    });
});

// 회원정보 수정
router.put('/users/me', authMiddleware, async (req, res) => {
    try {


    } catch (err) {
        return res.status(500).json(err);
    }
});

// 회원정보 삭제
router.delete('/users/me', authMiddleware, async (req, res) => {
    try {

    } catch (err) {
        
    }
});

module.exports = router;