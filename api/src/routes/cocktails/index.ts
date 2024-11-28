import { Sequelize } from 'sequelize';
import {dbConnect, models} from '../../db';

const getCocktails = async () => {
  await dbConnect();
  return await models.cocktail.findAll();
};

const getCocktail = async (id: string) => {
  await dbConnect();
  return await models.cocktail.findByPk(id);
}

const getCocktailsWithBars = async () => {
  await dbConnect();
  const results = await models.cocktail.findAll({
    include: [{
      association: 'bar',
      required: true
    }],
  });

  return results;
}

const getBarCocktails = async (barId: string) => {
  await dbConnect();
  return await models.cocktail.findAll({
    where: {
      bar_id: barId,
    }
  });
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
  getBarCocktails,
  getLiquors,
}