const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(token){
        const decoded = jwt.verify(token,"notes");
        if(decoded){
            // console.log(decoded);
            req.body.userID = decoded.userID;
            req.body.author = decoded.author;
            next()
        }else{
            res.send({"msg":"you are not authorized..."})
        }
    }
    else{
        res.send({"msg":"You are not authorized token missing"})
    }
}

module.exports = {
    auth
}