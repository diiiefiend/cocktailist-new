import { Sequelize } from 'sequelize';
import {dbConnect, models} from '../../db';
import * as aws from '../../aws';
import sharp from 'sharp';

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
  let cocktail: any = await models.cocktail.findByPk(id, {
    include: [{
      association: 'bar',
      required: true
    }],
  });

  cocktail = cocktail?.dataValues;

  if (cocktail?.img_file_name) {
    const filePath = `${cocktail.id}/original/${cocktail.img_file_name}`;

    try {
      // @ts-ignore
      cocktail.imgUrl = await aws.getImageUrl(filePath);
    } catch (e) {
      console.warn('image not found, proceeding anyway...');
    }
  }

  return cocktail;
}

const getCocktailsWithBars = async (page: number, limit: number) => {
  await dbConnect();
  // get a page of cocktails
  const results = await models.cocktail.findAndCountAll({
    include: [{
      association: 'bar',
      required: true
    }],
    order: [[ 'updated_at', 'DESC' ]],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    cocktails: results.rows,
    totalPages: Math.ceil(results.count / limit),
    currentPage: page,
  };
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
  if (cocktailImage) {
    const addImageStatus = uploadCocktailImages(cocktail.dataValues.id, cocktailImage);
    result.addImageStatus = addImageStatus;
  }

  return result;
}

const updateCocktail = async (cocktailId: string, cocktailData: CocktailData, cocktailImage?: CocktailImage) => {
  await dbConnect();

  const { name, barId, type, ingredients } = cocktailData;

  const cocktailUpdate = await models.cocktail.update({
    bar_id: barId,
    name,
    liquor: type,
    ingredients,
    updated_at: Date.now(),
  }, {
    where: {
      id: cocktailId,
    }
  });

  let result: any = {
    cocktailUpdateStatus: cocktailUpdate,
  };

  // upload image, if provided, to aws
  if (cocktailImage) {
    const addImageStatus = uploadCocktailImages(+cocktailId, cocktailImage);
    result.addImageStatus = addImageStatus;
  } else {
    // TODO: should handle case where one wants to unset the image
  }

  return result;
}

const uploadCocktailImages = async (cocktailId: number, cocktailImage: CocktailImage) => {
  const {
    originalname,
    mimetype,
    buffer,
    size,
  } = cocktailImage;

  const originalFolderPath = `${cocktailId}/original/${originalname}`;
  const smallFolderPath = `${cocktailId}/small/${originalname}`;
  
  await aws.uploadImage(originalFolderPath, buffer);

  // make thumbnail that is 150px tall
  // @ts-ignore
  const sharpInstance: sharp.Sharp = new sharp(buffer);
  const smallVersion = await sharpInstance.resize(null, 150).jpeg().toBuffer();
  await aws.uploadImage(smallFolderPath, smallVersion);

  const addImageResult = await models.cocktail.update({
    img_file_name: originalname,
    img_content_type: mimetype,
    img_file_size: size,
    img_updated_at: Date.now(),
  }, {
    where: {
      id: cocktailId,
    }
  });

  return addImageResult;
}

export default {
  getCocktail,
  getCocktailsWithBars,
  getLiquors,
  addCocktail,
  updateCocktail,
}