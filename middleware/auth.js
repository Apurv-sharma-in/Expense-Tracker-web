const jwt = require('jsonwebtoken');
const secretKey = 'a8f5f167f44f4964e6c998dee827110c84928374659102938475610293847561';

const authentication = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        if(!token){
            return res.status(401).json({message:"No token provided"});
        }
        
        const decode = jwt.verify(token,secretKey);
        req.user=decode;
        next();


    } catch (error) {
          return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports= authentication;