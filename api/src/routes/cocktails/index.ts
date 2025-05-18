import { Sequelize } from 'sequelize';
import {dbConnect, models} from '../../db';
import * as aws from '../../aws';

interface CocktailData {
  name: string;
  barId?: number;
  barName?: string;
  barAddress?: string;
  type: string;
  ingredients: string;
  imgFileName?: string;
  imgContentType?: string;
  imgFileSize?: number;
  imgUpdatedAt?: string;
};

interface CocktailImage {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: any;
}

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
    order: [[ 'updated_at', 'DESC' ]],
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

const addCocktail = async (cocktailData: CocktailData, cocktailImage?: CocktailImage) => {
  await dbConnect();

  const {
    name,
    barId,
    barName,
    barAddress,
    type,
    ingredients,
  } = cocktailData;

  // TODO: support creating a bar along with a cocktail
  // can use: https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstobar

  // first save the cocktail so we get an id
  const cocktail = await models.cocktail.create({
    bar_id: barId,
    name,
    liquor: type,
    ingredients,
  });

  let result = {
    ...cocktail.dataValues
  };

  // upload image, if provided, to aws
  // need to create and upload a thumbnail version too
  if (cocktailImage) {
    const {
      originalname,
      mimetype,
      buffer,
      size,
    } = cocktailImage;
    
    await aws.uploadImage(`${cocktail.dataValues.id}/original/${originalname}`, buffer);

    const addImageResult = await cocktail.update({
      img_file_name: originalname,
      img_content_type: mimetype,
      img_file_size: size,
      img_updated_at: Date.now(),
    });

    result = addImageResult.dataValues;
  }

  return result;
}

const updateCocktail = async (cocktailId: string, cocktailData: CocktailData) => {
  await dbConnect();

  const { name, barId, type, ingredients, imgFileName, imgContentType, imgFileSize, imgUpdatedAt } = cocktailData;

  return await models.cocktail.update({
    bar_id: barId,
    name,
    liquor: type,
    ingredients,
    img_file_name: imgFileName,
    img_content_type: imgContentType,
    img_file_size: imgFileSize,
    img_updated_at: imgUpdatedAt,
    updated_at: Date.now(),
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