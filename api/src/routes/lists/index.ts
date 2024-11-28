import { dbConnect, models } from '../../db';

const getLists = async () => {
  // TODO: requires a user session
  // TODO: This actually needs to be filtered down by user ID
  await dbConnect();
  return await models.list.findAll();
};

const getList = async (id: string) => {
  // TODO: requires a user session
  await dbConnect();
  const list = await models.list.findByPk(id);
  const listItems = await models.listitem.findAll({
    where: {
      list_id: id,
    }
  });

  let response = {};

  if (!!list) {
    response = {
      ...list.toJSON(),
      listItems: !!listItems ? listItems : [],
    }
  }

  return response;
};

export default {
  getLists,
  getList,
}