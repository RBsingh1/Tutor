require('dotenv').config();
const jwt = require('jsonwebtoken');
const checktoken = function (req, res, next){
 const token = req.header('Bearer');
 if (!token) { 
     return res.status(401).json({ msg: 'No token, authorization denied' });
   }
     try {
         jwt.verify(token, process.env.JWT_KEY,(error, decoded) => {
             if (error) {
                 return res.status(401).json({ msg: 'Token is not valid' });
             } else {
                 req.user = decoded.payload.user;
                //  console.log(decoded.payload.user)
                 next();
             }
         })
         }catch (err) {
             console.error('Something wrong with auth middleware');
             res.status(500).json({ msg: 'Server Error' });
         }
 }
 module.exports = checktoken
