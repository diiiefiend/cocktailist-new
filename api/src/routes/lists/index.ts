import { dbConnect, models } from '../../db';

interface ListData {
  name: string;
}

interface ListItemData {
  cocktailId: number;
  listId: number;
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

  await models.list.update({
    name,
    updated_at: Date.now(),
    }, {
    where: {
      id: listId,
      user_id: userId,
    }
  });
}

const deleteList = async (listId: string, userId: number) => {
  await dbConnect();

  const list = await models.list.findOne({
    where: {
      id: listId,
      user_id: userId,
    }
  });

  if (!list) {
    throw new Error('not a list associated with the logged in user');
  }

  // https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar  
  // @ts-ignore
  await list.removeListitems();

  await list.destroy();
}

// list item functions

const addListItem = async (itemData: ListItemData, userId: number) => {
  await dbConnect();

  const { cocktailId, listId } = itemData;

  // confirm the user is associated with the list
  const list = await models.list.findOne({
    where: {
      id: listId,
      user_id: userId,
    }
  });

  if (!list) {
    throw new Error('not a list associated with the logged in user');
  }

  await models.listitem.create({
    cocktail_id: cocktailId,
    list_id: listId,
  });

  await list.update({
    updated_at: Date.now(),
  });
}

const deleteListItem = async (itemId: string, userId: number) => {
  await dbConnect();

  const listItem = await models.listitem.findByPk(itemId);

  if (!listItem) {
    throw new Error('not an existing list item');
  }

  const list = await models.list.findOne({
    where: {
      // @ts-ignore
      id: listItem.list_id,
      user_id: userId,
    }
  });

  if (!list) {
    throw new Error('not a list associated with the logged in user');
  }

  await models.listitem.destroy({
    where: {
      id: itemId,
    }
  });

  await list.update({
    updated_at: Date.now(),
  });
}

export default {
  getLists,
  getListWithCocktails,
  addList,
  updateList,
  deleteList,
  addListItem,
  deleteListItem,
}