import { dbConnect, models } from '../../db';

const getBars = async () => {
  await dbConnect();
  return await models.bar.findAll();
};

const getBar = async (id: string) => {
  await dbConnect();
  return await models.bar.findByPk(id);
};

const getBarCocktails = async (barId: string) => {
  await dbConnect();
  return await models.cocktail.findAll({
    where: {
      bar_id: barId,
    }
  });
}

export default {
  getBars,
  getBar,
  getBarCocktails,
}