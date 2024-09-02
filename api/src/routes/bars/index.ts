import {connection} from '../../db';
import { getManyByFilter, getOneById } from '../utils';

const TABLE_NAME = 'bars';

const getBars = async () => {
  return getManyByFilter(TABLE_NAME);
};

const getBar = async (id: number) => {
  return getOneById(TABLE_NAME, id);
};

export default {
  getBars,
  getBar,
}