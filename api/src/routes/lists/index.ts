import {connection} from '../../db';
import { getManyByFilter, getOneById } from '../utils';

const TABLE_NAME = 'lists';
const LIST_ITEMS_TABLE_NAME = 'listitems';

const getLists = async () => {
  // TODO: requires a user session
  // TODO: This actually needs to be filtered down by user ID
  return getManyByFilter(TABLE_NAME);
};

const getList = async (id: number) => {
  // TODO: requires a user session
  // TODO: compose response with listitems
  const list = await getOneById(TABLE_NAME, id);
  const listItems = await getManyByFilter(LIST_ITEMS_TABLE_NAME, [`list_id=${id}`]);

  let response = {};

  if (typeof list !== 'string') {
    response = {
      ...list,
      listItems: typeof listItems !== 'string' ? listItems : [],
    }
  }

  return response;
};

export default {
  getLists,
  getList,
}