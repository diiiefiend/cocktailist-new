import { Sequelize, Op } from 'sequelize';
import { dbConnect, models } from '../db';
import * as aws from '../aws';

const search = async (searchTerm: string) => {
  await dbConnect();
  // search cocktails by name, ingredients
  const matchedCocktails: any = await models.cocktail.findAll({
    where: {
      [Op.or]: [
        {
          name: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Cocktail.name')),
            'LIKE',
            '%' + searchTerm.toLowerCase() + '%',
          ),
        },
        {
          ingredients: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Cocktail.ingredients')),
            'LIKE',
            '%' + searchTerm.toLowerCase() + '%',
          ),
        },
      ],
    },
    include: [
      {
        association: 'bar',
        required: true,
      },
    ],
  });

  const getImagePromises = matchedCocktails.map(async (cocktail: any, idx: number) => {
    if (cocktail?.img_file_name) {
      const filePath = `${cocktail.id}/original/${cocktail.img_file_name}`;

      try {
        // @ts-ignore
        matchedCocktails[idx].dataValues.imgUrl = await aws.getImageUrl(filePath);
      } catch (e) {
        console.trace(`image not found, proceeding anyway: ${e}`);
      }
    }
  });

  await Promise.all(getImagePromises);

  // search bars by name
  const matchedBars: any = await models.bar.findAll({
    where: {
      name: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('name')),
        'LIKE',
        '%' + searchTerm.toLowerCase() + '%',
      ),
    },
  });

  return {
    matchedCocktails,
    matchedBars,
  };
};

export default search;
