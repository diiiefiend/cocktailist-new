import {connection} from '../../db';
import { getManyByFilter, getOneById } from '../utils';

const TABLE_NAME = 'cocktails';

const getCocktails = async () => {
  return getManyByFilter(TABLE_NAME);
};

const getCocktail = async (id: number) => {
  return getOneById(TABLE_NAME, id);
};

export default {
  getCocktails,
  getCocktail,
}