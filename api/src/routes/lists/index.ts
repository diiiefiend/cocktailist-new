import { dbConnect, models } from '../../db';

const getLists = async () => {
  // TODO: requires a user session
  // TODO: This actually needs to be filtered down by user ID
  // we'll just hardcode a user for now
  await dbConnect();
  return await models.list.findAll({
    where: {
      user_id: 1,
    }
  });
};

const getListWithCocktails = async (id: string) => {
  // TODO: requires a user session
  await dbConnect();
  // TODO: confirm this list is associated with the logged in user
  const list = await models.list.findByPk(id);
  const listItems = await models.listitem.findAll({
    where: {
      list_id: id,
    },
    include: [{
      association: 'listedCocktail',
      required: true
    }],
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
  getListWithCocktails,
}