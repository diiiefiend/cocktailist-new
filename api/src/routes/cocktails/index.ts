import { Sequelize } from 'sequelize';
import {dbConnect, models} from '../../db';

interface CocktailData {
  name: string;
  barId: number;
  type: string;
  ingredients: string;
  imgUrl?: string;
};

const getCocktail = async (id: string) => {
  await dbConnect();
  return await models.cocktail.findByPk(id, {
    include: [{
      association: 'bar',
      required: true
    }],
  });
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

const addCocktail = async (cocktailData: CocktailData) => {
  await dbConnect();

  const { name, barId, type, ingredients, imgUrl} = cocktailData;

  await models.cocktail.create({
    bar_id: barId,
    name,
    liquor: type,
    ingredients,
    imageFileName: imgUrl, // TODO: update this later
  });
}

const updateCocktail = async (cocktailId: string, cocktailData: CocktailData) => {
  await dbConnect();

  const { name, barId, type, ingredients, imgUrl} = cocktailData;

  await models.cocktail.update({
    bar_id: barId,
    name,
    liquor: type,
    ingredients,
    imageFileName: imgUrl, // TODO: update this later
  }, {
    where: {
      id: cocktailId,
    }
  });
}

export default {
  getCocktail,
  getCocktailsWithBars,
  getLiquors,
  addCocktail,
  updateCocktail,
}