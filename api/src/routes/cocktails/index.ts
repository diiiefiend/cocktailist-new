import {dbConnect, models} from '../../db';

const getCocktails = async () => {
  await dbConnect();
  return await models.cocktail.findAll();
};

const getCocktail = async (id: number) => {
  await dbConnect();
  return await models.cocktail.findByPk(id);
}

const getCocktailsWithBars = async () => {
  await dbConnect();
  const results = await models.cocktail.findAll({
    include: [{
      model: models.bar,
      as: 'bar',
      required: true
    }],
  });

  return results;
}

export default {
  getCocktails,
  getCocktail,
  getCocktailsWithBars,
}