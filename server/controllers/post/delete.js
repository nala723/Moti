const { Post } = require('../../models');
const { remakeToken, isAuthorized } = require('../tokenFunctions/index');

module.exports = (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        if(!authorization){
            res.status(400).json({message : '유효한 회원이 아닙니다.'})
        }else{
            const token = authorization.split(' ')[1];
            if(!isAuthorized(token)){
                const newToken = remakeToken(req);
                res.set('accessToken', newToken); //헤더 설정
            }

            const post_id = req.body.post_id;
            Post.destroy({
                where : {
                    id : post_id
                }
            })
            .then((result) => {
                res.status(400).json({message : '삭제 성공'})
            })
            .catch((e) => {
                res.status(400).json({message : '삭제 실패 다시 시도해주세요'})
            })
        }
    } catch (error) {
        res.status(400).json({message : '삭제 실패 다시 시도해주세요'})
    }
}