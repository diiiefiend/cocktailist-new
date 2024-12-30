import { Sequelize } from 'sequelize';
import modelInitFns from './models';

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
    console.log('Connection has been established successfully using user ' + process.env.CLIST_DB_USER);
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  };
};

// init models
const models = modelInitFns.initModelsAndAssociations(sequelize);

export {
  dbConnect,
  getDbInstance,
  models,
};