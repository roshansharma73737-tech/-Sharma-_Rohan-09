
const  JWT = require('jsonwebtoken');

function authenticate( req ,res, next){
    const auth_herder = req.headers['Authentication'];
    const token = auth_herder && auth_herder.split(' ')[1];

    if(!token){ 
        return res.status(401).json( {error: 'the token is not given '});
    }

    JWT.verify(token , process.env.JWT_ACESSES_KEY, (err, playload)=>{
        if (err){
            return res.status(402).json({message:' THe token is invalid or expire '});
        }
        req.user =playload ;
        next();

    });
}

module.exports =  authenticate;
