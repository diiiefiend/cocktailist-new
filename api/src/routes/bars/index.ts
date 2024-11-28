import { dbConnect, models } from '../../db';

const getBars = async () => {
  await dbConnect();
  return await models.bar.findAll();
};

const getBar = async (id: string) => {
  await dbConnect();
  return await models.bar.findByPk(id);
};

export default {
  getBars,
  getBar,
}