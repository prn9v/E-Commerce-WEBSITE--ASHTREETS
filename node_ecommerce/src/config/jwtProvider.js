const jwt = require('jsonwebtoken');

const SECRET_KEY = "jfbdshinchandoraemonnobitasizuka";

const generateToken = (userId) =>{
    const token = jwt.sign({userId},SECRET_KEY,{expiresIn:"48h"});
    return token;
}


const getUserIdByToken = (token) =>{
    const decodedToken = jwt.verify(token,SECRET_KEY);
    return decodedToken.userId;
}

module.exports = { generateToken , getUserIdByToken};