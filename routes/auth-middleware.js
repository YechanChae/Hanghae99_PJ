const jwt = require("jsonwebtoken")
const User = require("../schemas/users")

module.exports = (req, res, next)=> {
    const { authorization } = req.headers           //HTTP 헤더 중에 authorization이 있는데 그걸 불러오고 (브라우저에 토큰값을 주려고)
    const [tokenType, tokenValue] = authorization.split(' ')    //그래서 로그인을 하면 router.post("/auth" 에서 토큰값을 jwt.sign 해서 브라우저에 넣는다.
                                                    //jwt.sign으로 암호화된 값이 tokenType과 tokenValue로 되고 그걸 split" "공백으로 2개로 나눈다.
    if (tokenType !== "Bearer") {                   //tokenType인 Bearer가 아니면 에러메시지 ㄱ
        res.status(401).send({
            errorMessage: "로그인이 필요합니다."
        })
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, "whi-secret-key")

        User.findById(userId).exec().then((user)=> {
            res.locals.user = user
            next()
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다."
        })
        return
    }

}