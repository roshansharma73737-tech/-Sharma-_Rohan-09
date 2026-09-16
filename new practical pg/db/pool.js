

// In the DB .js -->
// create the pool .js for connection from postgresql to database -->

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

});

pool.on('connect',() =>console.log('connected  to postgresql'));
pool.on('error', (err) =>{
    console.error('the postgresql is not connected ',err);
    process.exit(1);

});

module.export  = pool;