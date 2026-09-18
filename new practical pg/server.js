require('dotenv').config();
const express = require('express');
const cookiesparser = require('cookies-parser');
const  authroutes  = require('./routes/auth');


const app = express();

app.use(express.json());
app.use(cookiesparser());

app.use('/api/auth',authroutes);

app.get('/', (req , res) =>{
    res.send('postgresql +  JWT Authentication learning api is running ');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server is Running on the http://localhost:${PORT}`));