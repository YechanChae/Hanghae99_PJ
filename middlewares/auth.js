const jwt = require("jsonwebtoken");
const User = require("../schemas/users");

module.exports = (req, res, next) => {
    try {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");

    if (!authToken || authType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        })
        return;
        }
     
        const { userId } = jwt.verify(authToken, process.env.TOKEN_KEY);
        User.findOne({ userId }).then((user) => {
            res.locals.user = user;
            console.log(res.locals.user)
            next(); 
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        })
        return;
    }
}