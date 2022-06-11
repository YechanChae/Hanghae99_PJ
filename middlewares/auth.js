const jwt = require("jsonwebtoken");
const User = require("../schemas/users");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");

    if (!authToken || authType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        })
        return;
    }

    try {
        const { userId } = jwt.verify(authToken, "project-key");
        User.findOne(userId).then((user) => {
            res.locals.user = user;
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        })
        return;
    }
}