import { dbConnect, models } from '../../db';

/*
  // @ts-ignore
  console.log(Object.keys(list.__proto__));

[
  '_customGetters',    '_customSetters',
  'validators',        '_hasCustomGetters',
  '_hasCustomSetters', 'rawAttributes',
  '_isAttribute',      'getListitems',
  'countListitems',    'hasListitem',
  'hasListitems',      'setListitems',
  'addListitem',       'addListitems',
  'removeListitem',    'removeListitems',
  'createListitem',    'getOwner',
  'setOwner',          'createOwner'
]
*/

interface ListData {
  name: string;
}

interface AddCocktailToListsData {
  listIds: number[];
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

  // @ts-ignore
    const listItems = await list.getListitems({
    include: [{
      association: 'listedCocktail',
      required: true
    }],
    order: [[ 'updated_at', 'DESC' ]],
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

  return await models.list.create({
    name,
    user_id: userId,
  });
}

const updateList = async (listId: string, listData: ListData, userId: number) => {
  await dbConnect();

  const { name } = listData;

  return await models.list.update({
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

  // doesn't work properly bc "on delete cascade" isn't working
  // @ts-ignore
  // await list.removeListitems();

  // ... so we'll just do it manually
  const removedItemsCount = await models.listitem.destroy({
    where: {
      list_id: listId,
    }
  });

  console.log(`removed ${removedItemsCount} listitems`);

  await list.destroy();

  return { status: 'success' };
}

// list item functions
const getListInfoForCocktail = async (cocktailId: string, userId: number) => {
  await dbConnect();

  const {userLists, listItems} = await getExistingListItemsForOwner(+cocktailId, userId);

  // we want the list objects
  // @ts-ignore
  return listItems.map((item) => userLists.find(list => list.id === item.list_id));
}

const updateListItems = async (listsData: AddCocktailToListsData, cocktailId: string, userId: number) => {
  await dbConnect();

  const { listIds } = listsData;

  const {userLists, listItems} = await getExistingListItemsForOwner(+cocktailId, userId);

  // @ts-ignore
  const existingListIds = listItems.map(existingItem => existingItem.list_id);

  console.log('existingListIds: ', existingListIds);
  console.log('newListIds: ', listIds);

  const idsToDelete = existingListIds.filter(id => !listIds.includes(id));
  const idsToAdd = listIds.filter(id => !existingListIds.includes(id));


  console.log('ids to delete: ', idsToDelete);
  console.log('ids to add: ', idsToAdd);

  const createPromises = idsToAdd.map(async (listId) => {
    // confirm they don't already have a matching listitem
    const existingListitem = await models.listitem.findOne({
      where: {
        list_id: listId,
        cocktail_id: cocktailId,
      }
    });

    if (existingListitem) {
      return;
    }

    // confirm the user is associated with the list
    const list = await models.list.findOne({
      where: {
        id: listId,
        user_id: userId,
      }
    });

    if (!list) {
      return;
    }

    const createdItem = await models.listitem.create({
      cocktail_id: cocktailId,
      list_id: listId,
    });

    await list.update({
      updated_at: Date.now(),
    });

    return createdItem;
  });

  const deletePromises = idsToDelete.map(async (listId) => {
    // confirm they DO already have a matching listitem
    const existingListitem = await models.listitem.findOne({
      where: {
        list_id: listId,
        cocktail_id: cocktailId,
      }
    });

    if (!existingListitem) {
      return;
    }

    // confirm the user is associated with the list
    const list = await models.list.findOne({
      where: {
        id: listId,
        user_id: userId,
      }
    });

    if (!list) {
      return;
    }

    await existingListitem.destroy();

    await list.update({
      updated_at: Date.now(),
    });

    return { deleteResult: 'success' };
  });

  const allPromises: Promise<any>[] = [
    ...createPromises,
    ...deletePromises,
  ];

  const result = await Promise.all(allPromises);

  return result;
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

  return await list.update({
    updated_at: Date.now(),
  });
}

const getExistingListItemsForOwner = async (cocktailId: number, userId: number) => {
  const userLists = await models.list.findAll({
    where: {
      user_id: userId,
    }
  });

  // @ts-ignore
  const userListIds = userLists.map(list => list.id);

  const listItems = await models.listitem.findAll({
    where: {
      cocktail_id: cocktailId,
      list_id: userListIds,
    }
  });

  return {userLists, listItems}; 
}

export default {
  getLists,
  getListWithCocktails,
  addList,
  updateList,
  deleteList,
  getListInfoForCocktail,
  updateListItems,
  deleteListItem,
}