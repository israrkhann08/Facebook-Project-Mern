const jwt = require('jsonwebtoken');
const scrKey = "12345678abc";

function authentication(req, res, next){
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split('')[1];
    const token = req.headers.token; 

    if(token){
        try {
            const decoded = jwt.verify(token, scrKey);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message: "Invalid Token"});
        }
    }else{
        return res.status(401).json({message: "Token not Provided"});
    }
}
module.exports = authentication;