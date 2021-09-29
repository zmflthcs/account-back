var express = require('express');
var router = express.Router();
var axios = require('axios');
var qs = require('qs');
const jwt = require('jsonwebtoken');
const {User} = require('../models')

router.get('/', async function(req,res,next){
    try{
        const code = req.query.code;
        console.log(code);
        const data =  {
            'grant_type': 'authorization_code',
            'client_id': 'da119155da749377e72392a4a786b8f0',
            'redirect_uri': 'http://localhost:3000/oauth/kakao',
            'code' : code
        }
        const response = await axios({
            method: 'POST',
            url:'https://kauth.kakao.com/oauth/token',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            'data': qs.stringify(data),
        })
        console.log('response in oauth : ', response);
        let user;
        user= await axios({
            method: 'GET',
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${response.data.access_token}`
            }
        });
        console.log('this is user',user);
        const userId=user.data.id
        const email=user.data.kakao_account.email;
        const nickname=user.data.kakao_account.profile.nickname;
        const secret = process.env.JWT_SECRET;
        const userImage = user.data.properties.profile_image;
        const [userInDB, created] = await User.findOrCreate({
            where: { userId: userId },
            defaults: {
              email: email,
              nickname: nickname
            }
        })
        console.log(created); // The boolean indicating whether this instance was just created
                    
        const token  = jwt.sign(
            {
                _id: userId,
                email,
                nickname,
                userImage
            },
            secret,
            {
                expiresIn: '7d',
                issuer: 'owen',
                subject: 'userInfo'
            })
              
        var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 7); 
        res.cookie('token',token);
        res.status(201).json({
            message: 'logged in successfully',
            token,
            nickname,
            userImage,
        })
        

    }catch(error){
        console.log('this is error code here');
        console.error(error);
		next(error);
    }
})

module.exports = router;