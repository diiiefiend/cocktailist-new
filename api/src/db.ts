import mysql from 'mysql2/promise';

const DB_CONFIGS = {
  host: process.env.CLIST_DB_HOST,
  user: process.env.CLIST_DB_USER,
  password: process.env.CLIST_DB_PW,
  database: 'cocktailist',
};


const connection = mysql.createPool(DB_CONFIGS);

export {
  connection,
};