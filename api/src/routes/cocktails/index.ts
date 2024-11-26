import {dbConnect, connection} from '../../db';
import { Cocktail } from '../../db/models/Cocktail';
import { getManyByFilter, getOneById, genericResponse } from '../utils';

const TABLE_NAME = 'cocktails';

const getCocktails = async () => {
  return getManyByFilter(TABLE_NAME);
};

const getCocktail = async (id: number) => {
  return getOneById(TABLE_NAME, id);
};

const getCocktailORM = async (id: number) => {
  await dbConnect();
  return await Cocktail.findByPk(id);
}

const getCocktailsWithBars = async () => {
  try {
    const [results] = await connection.query<Array<genericResponse>>(
      `SELECT c.*,
        b.id as bar_id,
        b.name as bar_name,
        b.address as bar_address
      FROM ${TABLE_NAME} c JOIN bars b ON c.bar_id = b.id`
    );

    const formattedResult = results.map(entry => {
      const formatted: any = {
        ...entry,
        bar: {
          id: entry.bar_id,
          name: entry.bar_name,
          address: entry.bar_address,
        },
      };
      delete formatted.bar_id;
      delete formatted.bar_name;
      delete formatted.bar_address;

      return formatted;
    });

    console.log(formattedResult);
    // console.log(fields);

    return formattedResult;
  } catch (err) {
    return "failed: " + err;
  }
}

export default {
  getCocktails,
  getCocktailORM,
  getCocktail,
  getCocktailsWithBars,
}