import { Sequelize } from 'sequelize';
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

const getLiquors = async () => {
  await dbConnect();

  type List = Array<{liquor: string}>;
  
  const list = await models.cocktail.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('liquor')), 'liquor']
    ],
  }) as unknown as List;

  // list currently looks like
  // [
  //   {
  //     "liquor": "vodka"
  //   },
  //  ...
  // ]
  // so let's flatten it    

  const result = list.map(liquorObj => {
    return liquorObj.liquor;
  });

  return result;
}

export default {
  getCocktails,
  getCocktail,
  getCocktailsWithBars,
  getLiquors,
}