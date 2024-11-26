import mysql from 'mysql2/promise';

const DB_CONFIGS = {
  host: process.env.CLIST_DB_HOST,
  user: process.env.CLIST_DB_USER,
  password: process.env.CLIST_DB_PW,
  database: 'cocktailist',
};


const connection = mysql.createPool(DB_CONFIGS);

// export {
//   connection,
// };

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'cocktailist',
  process.env.CLIST_DB_USER!,
  process.env.CLIST_DB_PW,
  {
    host: process.env.CLIST_DB_HOST,
    dialect: 'mysql',
  }
);

const getDbInstance = () => {
  return sequelize;
}

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  };
};

// const dbModels = {
//   Cocktail: Cocktail(sequelize, Sequelize.DataTypes),
// }

export {
  dbConnect,
  getDbInstance,
  connection,
};