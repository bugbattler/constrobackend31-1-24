const jwt = require("jsonwebtoken");


const createToken = (req) => {
    try {
        const token = jwt.sign({
            email: req.body.username,
            userId: req.body.user_id
        }, "secrete this should be longer",
            { expiresIn: '1h' }
        );
        console.log("token : " + token);
        return token;
    } catch (error) {
        return null;
    }
}

module.exports = createToken;