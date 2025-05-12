import { dbConnect, models } from '../../db';

interface ListData {
  name: string;
}

const getLists = async (userId: number) => {
  await dbConnect();
  return await models.list.findAll({
    where: {
      user_id: userId,
    }
  });
};

const getListWithCocktails = async (listId: string, userId: number) => {
  await dbConnect();

  const list = await models.list.findOne({
    where: {
      id: listId,
      user_id: userId,
    }
  });

  if (!list) {
    throw new Error('no list associated with logged in user');
  };
  
  const listItems = await models.listitem.findAll({
    where: {
      list_id: listId,
    },
    include: [{
      association: 'listedCocktail',
      required: true
    }],
  });


  const response = {
    ...list.toJSON(),
    listItems: !!listItems ? listItems : [],
  };

  return response;
};

const addList = async (listData: ListData, userId: number) => {
  await dbConnect();

  const { name } = listData;

  // confirm the user doesn't have a list already with the same name
  const list = await models.list.findOne({
    where: {
      name,
      user_id: userId,
    }
  });

  if (list) {
    throw new Error('list with that name already exists!');
  }

  await models.list.create({
    name,
    user_id: userId,
  });
}

const updateList = async (listId: string, listData: ListData, userId: number) => {
  await dbConnect();

  const { name } = listData;

  await models.bar.update({
    name,
    }, {
    where: {
      id: listId,
      user_id: userId,
    }
  });
}

const deleteList = async (listId: string, userId: number) => {
  await dbConnect();

  await models.bar.destroy({
    where: {
      id: listId,
      user_id: userId,
    }
  });
}

export default {
  getLists,
  getListWithCocktails,
  addList,
  updateList,
  deleteList,
}