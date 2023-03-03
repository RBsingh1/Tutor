const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.header.authorization.splite(" ")[1];
        const decoded = jwt.verify(token, process.emitWarning.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error){
        return res.status(401).json({
            message:'Auth failed'
        });
    }

};