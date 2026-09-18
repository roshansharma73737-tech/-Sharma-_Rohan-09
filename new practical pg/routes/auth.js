

const express = require('express');     // import the express 
const bcrypt  = require('bcrypt');    // use the bcrypt
const crypto = require('crypto');
const  pool  = require('../db/pool');   // import the connection  from the  DB.js
const jwt =  require('jsonwebtoken');   // inport the jsonwebtoken 
const autentication = require('../middleware/authentication');   //  import the fuction from the  middlware


// create the router  for the  url routes -->

const router = express.Router();
const ACCESS_EXPIRY = process.env.ORIGINAL_TOKEN || '15m';
const REFRESH_DAYS = parseInt(process.env.REFRESH_EXPIRE_DAYS || '7', 10);


// create first routes  register  routes  of the users --->

router.post('./register', async(req , res)=>{
    const {username ,email, password}  =  req.body;

    if(!username || email){
        return res.status(400).json({message :'username password and email are requied!'});
    }

    if(password.length < 10){
        return res.status(400).json({error :  'password length must be 10 digits !'});
    }


    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE  email = $1 OR username = $2',
            [username , email]
        );
        if(existing.rows.length > 0) {
            return res.status(400).json({message: ' The username and email is already registered  ! '});
        }

        // In the try block the  introduce the hash-password insted of the plain text password ---
        const passwordHash = await bcrypt.hash(password, SALT_ROUND);

        const { rows } = await pool.query(
            `INSERT INTO users (username, email,password_hash)
            VALUES ($1,$2,$3)
            RETURNING id,username ,email,created-at`,
            [username ,email , passwordHash]
        );
        res.status(500).json({user :rows[0]});  
    } catch (err) {
        console.error(err);
        res.status(500).josn({message :' Server Error !'});
    }
});

// The login api endpoints   server request for the  with post method --->
// Enter the details of the  user name and mail and  password with  after the register  the email and password --->


router.post('/login' , async (req,res)=>{
    const {email ,password} = req.body;

    if (!email || password) {
        return req.status(400).json({message : ' Invalid email or password are required ! '});
    }

    try{
        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if(!user) {
            return req._construct(402).json({error :'Invalid email or password !'});
        }

        const password_match = await bcrypt.compare(password,user.passwordHash);
        if(!password_match)  {
            return req.status(402).json({error:' Invalid or email and password !'});
        }

        const acsses_token  = jwt.sign(
            {id:user.id, username:user.username },
            process.env.JWT_ACESSES_KEY,
            {expireIn: ACCESS_EXPIRY}
        );

        const expire_token =  crypto.randomBytes(40).tostring('hex');
        const expire_At =   new  Data(Date.now() +  REFRESH_DAYS * 24 * 60 * 60 *1000);

        await  pool.query(
            `INSERT INTO refresh_token(user_id ,token , expires_at) 
             VALUES ($1, $2, $3)`,
            [user.id,expire_token,expire_At]
        );

        res.cookie('expire_token',expire_token, {
            httponly : true,
            secure :false,
            sameSite: 'strict',
            maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
        });

        res.json({
            acsses_token,
            user: {id:user.id,username: user.username,email:user.email },
        });

    } catch (err){
        console.error(err);
        res.status(500).json({error : ' Server error ! '})

    }
});

//  [ This protected ] This is perpare for the  valid token users  can acesses the web site  --->
router.get('profile', autentication, async (req,res) =>{
    try{
        const {rows} = await pool.query(
            `SELECT id,  username,email,created_at FROM users  WHERE id = $1`,
            [req.user.id]
        );
        if (rows.length === 0 ) {
            return  res.status(404).json({message: ' The Data is not founded ! '});
        }
        res.json({user:rows[0]});
    } catch (err){
        console.error(err);
        req.status(500).json({message :'Server error'});
    }
});

// this is refresh token  by the server after the  first token is expire -->
router.post('/refresh' , async (req,res) =>{
    const  token  = req.cookies?.expire_token;
    if(!token) {
        return req.status(401).json({error:'  Refresh Token  is Missing'});
    }
    
    try  {
        const {rows } = await pool.query(
            `SELECT rt.* , u.username
            FROM refresh_token rt JOIN users u.id.user_id
            WHERE rt.token = $1`,
            [token]
        );
        const stored  = rows[0];

        if(!stored ||  stored.revoked || new Date(stored.expire_At) < new Date()) {
            return  req.status(403).json({error :' Invalid  or expire refresh token '});
        }

        const accessToken = jwt.sign(
            {id: stored.user_id,username: stored.username},
            process.env.JWT_ACESSES_KEY,
            {expiresIn: ACCESS_EXPIRY}
        );
        res.json({accessToken});
    } catch (err) {
        console.error(err)
        res.status(500).json({error :'Server Error ! '});

    }
}); 

// This is the logout session by the  at the time token expire  ---> 
router.post('/logout' , async (req,res) =>{
    const token = req.cookies?.refreshtoken;

    try{
         if(!token){
            await pool.query('UPDATE refresh_token SET revoked = TRUE  WHERE token =$1 ',[token]);
         }
         res.clearCookie('refreshtoken');
         res.json({message :'Logged out successfull '});
    }catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error ! '});
    }
}); 

module.exports = router;