

const express = require('express');     // import the express 
const bcrypt  = require('bcrypt');    // use the bcrypt
const crypto = require('crypto');
const  pool  = require('../db/pool');   // import the connection  from the  DB.js
const jwt =  require('jsonwebtoken');   // inport the jsonwebtoken 
const autentication = require('../middleware/authentication');   //  import the fuction from the  middlware


// create the router  for the  url routes -->

const router = express.Router();


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

        const { rows } = await Pool.query(
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
// Enter the details of the  user name and email and  password with  after the register  the email and password --->


router.post('/login' , async (req,res,next )=>{
    const {email ,password} = req.body;

    if (!email || password) {
        return req.status(400).json({message : ' Invalid email or password are required ! '});
    }

    try{
        const {rows} = await Pool.query('SELECT * FROM users WHERE email = $1', [email]);
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
            {expireIn: ACCESSE_EXPIRE}
        );

        const expire_token =  crypto.randomBytes(40).tostring('hex');
        const exireAt =  = new  Data(Date.now() +  REFRESH_DAYS * 24 * 60 * 60 *1000);

        await  pool.query()
    } catch {

    }
})