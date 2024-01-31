const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    console.log(req.headers);
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(
            token,
            "secrete this should be longer"
        );
        // req.body ={
        //     email:decodedToken.email,
        //     userId:decodedToken.userId
        // }
        next();
    }catch(error){
        res.status(401).json({
            message:'Auth Failed'
        })
    }
}