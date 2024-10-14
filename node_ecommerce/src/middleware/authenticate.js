const jwtProvider = require('../config/jwtProvider.js');
const userService = require('../services/userservice.js');

const authenticate = async(req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return req.status(404).send({error: "Token Not Found..."})
        }

        const userId = jwtProvider.getUserIdByToken(token);
        const user = userService.findUserById(userId);
        req.user = user;
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
    next();
}

module.exports = authenticate