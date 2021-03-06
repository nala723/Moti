const { user, RandomAdvice } = require('../../models');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken} = require('../tokenFunctions');

module.exports = async (req, res) => {
    try {
        //const userInfo = await user.findOne({attributes: ['email', 'password', 'profile'], where: {email: req.body.email, password: req.body.password}});
        const userInfo = await user.findOne({attributes: ['id', 'email', 'username', 'password', 'profile'], where: {email: req.body.email}});
        const advice = await RandomAdvice.findOne({where : {id : req.body.adviceID}});
        const userProfile = userInfo.dataValues.profile;

        if(!userInfo){
            return res.status(404).json({message : 'user Not found'});
        }

        bcrypt.compare(req.body.password, userInfo.dataValues.password).then((isMatch) => {
            if(!isMatch){
                return res.status(404).json({message : 'user Not found'});
            }else{
                delete userInfo.dataValues.password //추가해봄.
                delete userInfo.dataValues.profile
                const access_token = generateAccessToken(userInfo.dataValues);
                const refresh_token = generateRefreshToken(userInfo.dataValues);
                console.log(advice.dataValues);
                res.cookie('RefreshToken', refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
                res.json({data : {
                    accessToken : access_token, 
                    username : userInfo.dataValues.username,
                    profile : userProfile,
                    RandomAdvice : advice.dataValues.advice,
                    author : advice.dataValues.author
                }, message : 'login ok'});
            }
        })
      
    } catch (error) {
        console.log(error);
    }

}
