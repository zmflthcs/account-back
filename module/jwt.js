var jwt = require('jsonwebtoken');
var {User} = require('../models');
const loginCheck = async(req,res,next) => {
try{
    console.log(req.cookies);
     let token = req.cookies.token;
    console.log('token', token);``
    
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
     
    if(decoded){


        const userId = decoded._id;
        console.log('userId',userId);
        const user = await User.findOne({where:{userId: userId}})
        console.log('user',user);
        res.locals.userId = user.userId;
        res.locals.userKey = user.id;
        next();
    }
    }catch(error){
        console.log(error);
        res.status(400).json('Token not valid');
    }
}
module.exports = loginCheck;